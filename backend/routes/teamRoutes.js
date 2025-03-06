const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  toggleTeamStatus
} = require('../controllers/teamController');

const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// Routes công khai
router.get('/', getTeams);
router.get('/:id', getTeam);

// Routes yêu cầu quyền admin
router.use(protect, isAdmin);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.put('/:id/toggleTeamStatus', toggleTeamStatus); 

module.exports = router;