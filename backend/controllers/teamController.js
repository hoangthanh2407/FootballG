const Team = require('../models/Team');

// @desc    Lấy danh sách tất cả đội bóng
// @route   GET /api/teams
// @access  Public
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy thông tin một đội bóng
// @route   GET /api/teams/:id
// @access  Public
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đội bóng'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Tạo đội bóng mới
// @route   POST /api/teams
// @access  Private/Admin
exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật thông tin đội bóng
// @route   PUT /api/teams/:id
// @access  Private/Admin
exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đội bóng'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Vô hiệu hóa đội bóng (không xóa khỏi CSDL)
// @route   PUT /api/teams/:id/toggleTeamStatus
// @access  Private/Admin
exports.toggleTeamStatus = async (req, res, next) => {
  try {
    // Đầu tiên tìm team để lấy trạng thái hiện tại
    const currentTeam = await Team.findById(req.params.id);
    
    if (!currentTeam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đội bóng'
      });
    }
    
    // Đảo ngược trạng thái isActive
    const newStatus = !currentTeam.isActive;
    
    // Cập nhật team với trạng thái mới
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { isActive: newStatus },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedTeam
    });
  } catch (err) {
    next(err);
  }
};