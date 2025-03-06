const express = require('express');
const {
  getGifts,
  getGift,
  createGift,
  updateGift,
  redeemGift,
  getMyRedemptions,
  getAllRedemptions,
  updateRedemptionStatus
} = require('../controllers/giftController');

const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// Routes công khai
router.get('/', getGifts);
router.get('/:id', getGift);

// Routes yêu cầu xác thực
router.use(protect);
router.post('/:id/redeem', redeemGift);
router.get('/redemptions', getMyRedemptions);

// Routes yêu cầu quyền admin
router.use(isAdmin);
router.post('/', createGift);
router.put('/:id', updateGift);
router.get('/redemptions/all', getAllRedemptions);
router.put('/redemptions/:id', updateRedemptionStatus);

module.exports = router;