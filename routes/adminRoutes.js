const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController } = require('../controllers/AdminCtrl');
const router = express.Router();

//GET method || Users
router.get('/getAllUsers', authMiddleware, getAllUsersController);

//GET method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

module.exports = router;