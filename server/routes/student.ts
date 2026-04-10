import { Hono } from 'hono';
import { Vote } from '../models/Vote.js';
import { Poll } from '../models/Poll.js';

export const studentRouter = new Hono();

studentRouter.get('/history', async (c) => {
  const user = c.get('user');
  
  if (!user || user.role !== 'student') {
    return c.json({ error: 'Acceso denegado' }, 403);
  }

  const votes = await Vote.find({ studentId: user._id }).sort({ createdAt: -1 });

  const history = await Promise.all(votes.map(async (vote) => {
    const poll = await Poll.findById(vote.pollId);
    if (!poll) return null;
    
    const formattedAt = new Date(vote.createdAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      pollId: poll._id,
      title: poll.title,
      code: poll.code,
      status: poll.status,
      votedOptionIndex: vote.optionIndex,
      votedOptionText: poll.options[vote.optionIndex]?.text || '',
      votedAt: vote.createdAt,
      formattedAt
    };
  }));

  const filteredHistory = history.filter(item => item !== null);
  
  return c.json({ history: filteredHistory });
});