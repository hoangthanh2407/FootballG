const Prediction = require('../models/Prediction');
const Match = require('../models/Match');
const { determineMatchResult } = require('../utils/helpers');

// @desc    Lấy danh sách dự đoán của người dùng
// @route   GET /api/predictions
// @access  Private
exports.getPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .populate('matchId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Tạo dự đoán cho trận đấu
// @route   POST /api/predictions
// @access  Private
exports.createPrediction = async (req, res, next) => {
  try {
    const { matchId, predictedHomeScore, predictedAwayScore } = req.body;
    
    // Kiểm tra trận đấu tồn tại
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trận đấu'
      });
    }
    
    // Kiểm tra trận đấu đã diễn ra chưa
    if (match.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Không thể dự đoán cho trận đấu đã diễn ra'
      });
    }

    // Kiểm tra người dùng đã dự đoán trận đấu này chưa
    const existingPrediction = await Prediction.findOne({
      userId: req.user.id,
      matchId
    });

    if (existingPrediction) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã dự đoán cho trận đấu này'
      });
    }

    // Xác định kết quả dự đoán
    const predictedResult = determineMatchResult(
      predictedHomeScore,
      predictedAwayScore
    );

    // Tạo dự đoán
    const prediction = await Prediction.create({
      userId: req.user.id,
      matchId,
      predictedHomeScore,
      predictedAwayScore,
      predictedResult
    });

    res.status(201).json({
      success: true,
      data: prediction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy tất cả dự đoán (dành cho admin)
// @route   GET /api/predictions/all
// @access  Private/Admin
exports.getAllPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find()
      .populate('userId', 'username fullName')
      .populate('matchId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy dự đoán cho một trận đấu cụ thể của người dùng
// @route   GET /api/predictions/match/:matchId
// @access  Private
exports.getMatchPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      userId: req.user.id,
      matchId: req.params.matchId
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa dự đoán cho trận đấu này'
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (err) {
    next(err);
  }
};