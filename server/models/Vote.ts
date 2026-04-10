import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  optionIndex: { type: Number, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voterName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);