const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController } = require('../controllers/doctorCtrl');

const router = express.Router();

//POST single doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

//POST Update Profile
router.post('/updateProfile', authMiddleware, updateProfileController);

module.exports = router;