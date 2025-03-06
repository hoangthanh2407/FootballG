const express = require('express');
const {
  getPredictions,
  createPrediction,
  getAllPredictions,
  getMatchPrediction
} = require('../controllers/predictionController');

const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// Routes yêu cầu xác thực
router.use(protect);
router.get('/', getPredictions);
router.post('/', createPrediction);
router.get('/match/:matchId', getMatchPrediction);

// Routes yêu cầu quyền admin
router.get('/all', isAdmin, getAllPredictions);

module.exports = router;