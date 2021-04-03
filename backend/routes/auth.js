const express = require('express');
const router = express.Router();

const { isAuthunticatedUser, authorizeRole } = require('../middlewares/auth')

const { registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    getAllUser,
    getUserDetails,
    updateUser,
    deleteUser } = require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logout);
router.route('/me').get(isAuthunticatedUser, getUserProfile);
router.route('/password/update').put(isAuthunticatedUser, updatePassword);
router.route('/me/update').put(isAuthunticatedUser, updateProfile);
router.route('/admin/users').get(isAuthunticatedUser, authorizeRole('admin'), getAllUser);
router.route('/admin/user/:id')
    .get(isAuthunticatedUser, authorizeRole('admin'), getUserDetails)
    .put(isAuthunticatedUser, authorizeRole('admin'), updateUser)
    .delete(isAuthunticatedUser, authorizeRole('admin'), deleteUser)


module.exports = router;