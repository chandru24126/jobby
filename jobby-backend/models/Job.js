const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  category: { type: String },
  experience: { type: String },
  salary: { type: String },
  description: { type: String, required: true },
  requirements: { type: String },
  isActive: { type: Boolean, default: true },
  applicationCount: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);