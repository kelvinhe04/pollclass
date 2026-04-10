import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['professor', 'student'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const User = mongoose.model('User', userSchema);