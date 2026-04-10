import { Hono } from 'hono';
import { Vote } from '../models/Vote.js';
import { Poll } from '../models/Poll.js';
import { User } from '../models/User.js';

export const votesRouter = new Hono();

votesRouter.post('/:pollId/vote', async (c) => {
  const pollId = c.req.param('pollId');
  const { optionIndex, voterName } = await c.req.json();

  // Obtener el estudiante autenticado desde el contexto (si existe)
  const user = c.get('user');
  let studentId = null;
  let finalVoterName = voterName;

  if (user) {
    // Estudiante autenticado
    if (user.role !== 'student') {
      return c.json({ error: 'Solo estudiantes pueden votar' }, 403);
    }
    studentId = user._id;
    finalVoterName = user.name;
  } else {
    // Voto anónimo (deprecated, pero mantenemos compatibilidad)
    if (!voterName) {
      return c.json({ error: 'voterName es requerido' }, 400);
    }
  }

  if (optionIndex === undefined) {
    return c.json({ error: 'optionIndex es requerido' }, 400);
  }

  const poll = await Poll.findById(pollId);
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }

  if (poll.status === 'closed') {
    return c.json({ error: 'La encuesta está cerrada' }, 400);
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return c.json({ error: 'Índice de opción inválido' }, 400);
  }

  // Validar voto único por estudiante autenticado
  if (studentId) {
    const existingVote = await Vote.findOne({ pollId, studentId });
    if (existingVote) {
      return c.json({ error: 'Ya has votado en esta encuesta' }, 409);
    }
  } else {
    // Voto anónimo (deprecated)
    const existingVote = await Vote.findOne({ pollId, voterName });
    if (existingVote) {
      return c.json({ error: 'Ya has votado en esta encuesta' }, 409);
    }
  }

  const vote = new Vote({ 
    pollId, 
    optionIndex, 
    studentId: studentId || undefined,
    voterName: finalVoterName
  });
  await vote.save();

  poll.options[optionIndex].votes += 1;
  await poll.save();

  return c.json({ message: 'Voto registrado', vote }, 201);
});

votesRouter.get('/:pollId/results', async (c) => {
  const pollId = c.req.param('pollId');

  const poll = await Poll.findById(pollId);
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }

  const votes = await Vote.find({ pollId }).sort({ createdAt: -1 });

  const votesWithDetails = votes.map(vote => {
    const optionText = poll.options[vote.optionIndex]?.text || '';
    const formattedAt = new Date(vote.createdAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      _id: vote._id,
      voterName: vote.voterName,
      optionIndex: vote.optionIndex,
      optionText,
      createdAt: vote.createdAt,
      formattedAt
    };
  });

  return c.json({
    poll: {
      _id: poll._id,
      title: poll.title,
      status: poll.status,
      code: poll.code,
      options: poll.options,
      totalVotes: poll.options.reduce((sum, opt) => sum + opt.votes, 0)
    },
    votes: votesWithDetails
  });
});

