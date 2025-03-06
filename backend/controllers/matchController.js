const Match = require('../models/Match');
const Team = require('../models/Team');
const Prediction = require('../models/Prediction');
const User = require('../models/User');
const { determineMatchResult, calculatePoints } = require('../utils/helpers');

// @desc    Lấy danh sách tất cả trận đấu
// @route   GET /api/matches
// @access  Public
exports.getMatches = async (req, res, next) => {
  try {
    // Lọc theo status nếu có
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const matches = await Match.find(filter).sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy thông tin một trận đấu
// @route   GET /api/matches/:id
// @access  Public
exports.getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trận đấu'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Tạo trận đấu mới
// @route   POST /api/matches
// @access  Private/Admin
exports.createMatch = async (req, res, next) => {
  try {
    console.log(req.body);

    let { homeTeamId, awayTeamId, startTime, endTime, competition, venue } = req.body;

    // Chuyển đổi startTime và endTime thành đối tượng Date hợp lệ
    startTime = new Date(startTime);
    endTime = endTime ? new Date(endTime) : null;

    if (isNaN(startTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian bắt đầu không hợp lệ'
      });
    }

    if (endTime && isNaN(endTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian kết thúc không hợp lệ'
      });
    }

    // Lấy thông tin đội bóng
    const homeTeam = await Team.findById(homeTeamId);
    const awayTeam = await Team.findById(awayTeamId);
    
    if (!homeTeam || !awayTeam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đội bóng'
      });
    }

    // Kiểm tra đội bóng có đang hoạt động không
    if (!homeTeam.isActive || !awayTeam.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo trận đấu với đội bóng đã bị vô hiệu hóa'
      });
    }

    // Tạo trận đấu
    const match = await Match.create({
      homeTeam: {
        teamId: homeTeam._id,
        name: homeTeam.name,
        logo: homeTeam.logo
      },
      awayTeam: {
        teamId: awayTeam._id,
        name: awayTeam.name,
        logo: awayTeam.logo
      },
      startTime,
      endTime,
      competition,
      stadium: venue
    });

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Cập nhật kết quả trận đấu
// @route   PUT /api/matches/:id/result
// @access  Private/Admin
exports.updateMatchResult = async (req, res, next) => {
  try {
    const { homeScore, awayScore } = req.body;
    
    // Tìm trận đấu
    let match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trận đấu'
      });
    }

    // Xác định kết quả trận đấu
    const result = determineMatchResult(homeScore, awayScore);

    // Cập nhật kết quả trận đấu
    match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        homeScore,
        awayScore,
        result,
        status: 'finished'
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Cập nhật điểm cho các dự đoán
    const predictions = await Prediction.find({ matchId: match._id });
    
    for (const prediction of predictions) {
      // Tính toán điểm
      const points = calculatePoints(prediction, match);
      
      // Cập nhật trạng thái dự đoán
      await Prediction.findByIdAndUpdate(
        prediction._id,
        {
          isCorrect: points > 0,
          pointsEarned: points
        }
      );

      // Cập nhật điểm người dùng
      if (points > 0) {
        await User.findByIdAndUpdate(
          prediction.userId,
          { $inc: { points } }
        );
      }
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật thông tin trận đấu
// @route   PUT /api/matches/:id
// @access  Private/Admin
exports.updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trận đấu'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};