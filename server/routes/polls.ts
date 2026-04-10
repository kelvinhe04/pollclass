import { Hono } from 'hono';
import { Poll } from '../models/Poll.js';
import { generateUniqueCode } from '../utils/generateCode.js';

export const pollsRouter = new Hono();

pollsRouter.post('/', async (c) => {
  try {
    const user = c.get('user');
    const { title, options } = await c.req.json();
    
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return c.json({ error: 'Título y al menos 2 opciones son requeridos' }, 400);
    }

    const code = await generateUniqueCode();
    
    const poll = new Poll({
      title,
      options: options.map((opt: string) => ({ text: opt, votes: 0 })),
      code,
      professorId: user._id
    });

    await poll.save();
    
    return c.json(poll, 201);
  } catch (err) {
    console.error('Error creating poll:', err);
    throw err;
  }
});

pollsRouter.get('/', async (c) => {
  const user = c.get('user');
  const polls = await Poll.find({ professorId: user._id }).sort({ createdAt: -1 });
  return c.json(polls);
});

pollsRouter.get('/code/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const poll = await Poll.findOne({ code });
  
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }
  return c.json(poll);
});

pollsRouter.get('/:code/for-student', async (c) => {
  try {
    const code = c.req.param('code').toUpperCase();
    const user = c.get('user');
    
    const poll = await Poll.findOne({ code });
    
    if (!poll) {
      return c.json({ error: 'Encuesta no encontrada' }, 404);
    }
    
    const { Vote } = await import('../models/Vote.js');
    const existingVote = await Vote.findOne({ 
      pollId: poll._id, 
      studentId: user._id 
    });
    
    const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0);
    
    const response: any = {
      _id: poll._id,
      title: poll.title,
      options: poll.options,
      status: poll.status,
      code: poll.code,
      createdAt: poll.createdAt,
      totalVotes,
      alreadyVoted: false
    };
    
    if (existingVote) {
      response.alreadyVoted = true;
      response.existingVote = {
        optionIndex: existingVote.optionIndex,
        optionText: poll.options[existingVote.optionIndex]?.text || '',
        createdAt: existingVote.createdAt
      };
    }
    
    return c.json(response);
  } catch (err) {
    console.error('Error in for-student endpoint:', err);
    throw err;
  }
});

pollsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  
  const poll = await Poll.findById(id);
  
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }

  const { Vote } = await import('../models/Vote.js');
  const existingVote = await Vote.findOne({ 
    pollId: poll._id, 
    studentId: user._id 
  });

  const response: any = {
    _id: poll._id,
    title: poll.title,
    options: poll.options,
    status: poll.status,
    code: poll.code,
    createdAt: poll.createdAt,
    alreadyVoted: false
  };

  if (existingVote) {
    response.alreadyVoted = true;
    response.existingVote = {
      optionIndex: existingVote.optionIndex,
      optionText: poll.options[existingVote.optionIndex]?.text || '',
      createdAt: existingVote.createdAt
    };
  }

  return c.json(response);
});

pollsRouter.patch('/:id/close', async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  
  const poll = await Poll.findById(id);
  
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }

  if (poll.professorId.toString() !== user._id) {
    return c.json({ error: 'No puedes cerrar encuestas de otro profesor' }, 403);
  }

  poll.status = 'closed';
  poll.closedAt = new Date();
  await poll.save();
  
  return c.json(poll);
});

pollsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  
  const poll = await Poll.findById(id);
  
  if (!poll) {
    return c.json({ error: 'Encuesta no encontrada' }, 404);
  }

  if (poll.professorId.toString() !== user._id) {
    return c.json({ error: 'No puedes eliminar encuestas de otro profesor' }, 403);
  }

  await Poll.findByIdAndDelete(id);

  const { Vote } = await import('../models/Vote.js');
  await Vote.deleteMany({ pollId: id });

  return c.json({ message: 'Encuesta eliminada' });
});