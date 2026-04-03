import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// ⚠️ Ici, on force le nom de la collection "user"
const User = mongoose.model('User', userSchema, 'user');

export default User;