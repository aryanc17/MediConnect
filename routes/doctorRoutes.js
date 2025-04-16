const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorCtrl');

const router = express.Router();

//POST single doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

//POST Update Profile
router.post('/updateProfile', authMiddleware, updateProfileController);

//POST Get single doctor info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//GET Appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);

//POST update status
router.post('/update-status', authMiddleware, updateStatusController);

module.exports = router;