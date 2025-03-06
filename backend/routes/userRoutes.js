const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserRankings
} = require('../controllers/userController');

const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả các routes
router.use(protect);

// Routes không yêu cầu quyền admin
router.get('/rankings', getUserRankings);

// Routes yêu cầu quyền admin
router.use(isAdmin);
router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;