const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/AdminCtrl');
const router = express.Router();

//GET method || Users
router.get('/getAllUsers', authMiddleware, getAllUsersController);

//GET method || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST method || Doctor Account status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

module.exports = router;