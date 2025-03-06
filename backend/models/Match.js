const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    homeTeam: {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      logo: {
        type: String
      }
    },
    awayTeam: {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      logo: {
        type: String
      }
    },
    startTime: {
      type: Date,
      required: [true, 'Vui lòng nhập thời gian bắt đầu trận đấu']
    },
    endTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'finished'],
      default: 'upcoming'
    },
    homeScore: {
      type: Number,
      default: null
    },
    awayScore: {
      type: Number,
      default: null
    },
    result: {
      type: String,
      enum: ['home', 'away', 'draw'],
      default: undefined
    },
    competition: {
      type: String,
      default: null
    },
    stadium: {
      type: String,
      default: null
    } 
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Match', MatchSchema);