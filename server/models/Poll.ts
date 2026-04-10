import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: false });

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: { 
    type: [optionSchema], 
    required: true,
    validate: {
      validator: function(arr: unknown[]) {
        return Array.isArray(arr) && arr.length >= 2;
      },
      message: 'Debe tener al menos 2 opciones'
    }
  },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  code: { type: String, required: true, unique: true, uppercase: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
});

export const Poll = mongoose.model('Poll', pollSchema);