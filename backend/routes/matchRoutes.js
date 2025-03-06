const express = require('express');
const {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  updateMatchResult
} = require('../controllers/matchController');

const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// Routes công khai
router.get('/', getMatches);
router.get('/:id', getMatch);

// Routes yêu cầu quyền admin
router.use(protect, isAdmin);
router.post('/', createMatch);
router.put('/:id', updateMatch);
router.put('/:id/result', updateMatchResult);

module.exports = router;