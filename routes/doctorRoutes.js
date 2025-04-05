const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController } = require('../controllers/doctorCtrl');

const router = express.Router();

//POST single doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

//POST Update Profile
router.post('/updateProfile', authMiddleware, updateProfileController);

//POST Get single doctor info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

module.exports = router;