const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên đội bóng'],
      unique: true,
      trim: true
    },
    logo: {
      type: String,
      default: 'no-photo.jpg'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Team', TeamSchema);