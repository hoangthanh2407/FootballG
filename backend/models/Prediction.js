const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true
    },
    predictedHomeScore: {
      type: Number,
      required: [true, 'Vui lòng nhập dự đoán điểm đội nhà']
    },
    predictedAwayScore: {
      type: Number,
      required: [true, 'Vui lòng nhập dự đoán điểm đội khách']
    },
    predictedResult: {
      type: String,
      enum: ['home', 'away', 'draw'],
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: null
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Đảm bảo mỗi người dùng chỉ có thể dự đoán một lần cho mỗi trận đấu
PredictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', PredictionSchema);