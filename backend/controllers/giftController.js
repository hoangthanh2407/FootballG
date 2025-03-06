const Gift = require('../models/Gift');
const GiftRedemption = require('../models/GiftRedemption');
const User = require('../models/User');

// @desc    Lấy danh sách quà tặng
// @route   GET /api/gifts
// @access  Public
exports.getGifts = async (req, res, next) => {
  try {
    const gifts = await Gift.find({ isActive: true }).sort({ pointsCost: 1 });

    res.status(200).json({
      success: true,
      count: gifts.length,
      data: gifts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy thông tin quà tặng
// @route   GET /api/gifts/:id
// @access  Public
exports.getGift = async (req, res, next) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quà tặng'
      });
    }

    res.status(200).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Tạo quà tặng mới
// @route   POST /api/gifts
// @access  Private/Admin
exports.createGift = async (req, res, next) => {
  try {
    const gift = await Gift.create(req.body);

    res.status(201).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật thông tin quà tặng
// @route   PUT /api/gifts/:id
// @access  Private/Admin
exports.updateGift = async (req, res, next) => {
  try {
    const gift = await Gift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quà tặng'
      });
    }

    res.status(200).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Đổi quà
// @route   POST /api/gifts/:id/redeem
// @access  Private
exports.redeemGift = async (req, res, next) => {
  try {
    // Tìm quà tặng
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quà tặng'
      });
    }

    // Kiểm tra trạng thái quà tặng
    if (!gift.isActive || gift.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quà tặng không khả dụng'
      });
    }

    // Lấy thông tin người dùng
    const user = await User.findById(req.user.id);

    // Kiểm tra điểm
    if (user.points < gift.pointsCost) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không đủ điểm để đổi quà tặng này'
      });
    }

    // Tạo phiếu đổi quà
    const redemption = await GiftRedemption.create({
      userId: user._id,
      giftId: gift._id,
      pointsUsed: gift.pointsCost
    });

    // Cập nhật điểm người dùng
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { points: -gift.pointsCost } }
    );

    // Cập nhật số lượng quà
    await Gift.findByIdAndUpdate(
      gift._id,
      { $inc: { quantity: -1 } }
    );

    res.status(200).json({
      success: true,
      data: redemption
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy lịch sử đổi quà của người dùng
// @route   GET /api/gifts/redemptions
// @access  Private
exports.getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await GiftRedemption.find({ userId: req.user.id })
      .populate('giftId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: redemptions.length,
      data: redemptions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy tất cả lịch sử đổi quà (dành cho admin)
// @route   GET /api/gifts/redemptions/all
// @access  Private/Admin
exports.getAllRedemptions = async (req, res, next) => {
  try {
    const redemptions = await GiftRedemption.find()
      .populate('userId', 'username fullName')
      .populate('giftId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: redemptions.length,
      data: redemptions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật trạng thái đổi quà
// @route   PUT /api/gifts/redemptions/:id
// @access  Private/Admin
exports.updateRedemptionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const redemption = await GiftRedemption.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!redemption) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu đổi quà'
      });
    }

    // Nếu trạng thái là 'cancelled', hoàn lại điểm cho người dùng
    if (status === 'cancelled') {
      await User.findByIdAndUpdate(
        redemption.userId,
        { $inc: { points: redemption.pointsUsed } }
      );

      // Cập nhật lại số lượng quà
      await Gift.findByIdAndUpdate(
        redemption.giftId,
        { $inc: { quantity: 1 } }
      );
    }

    res.status(200).json({
      success: true,
      data: redemption
    });
  } catch (err) {
    next(err);
  }
};