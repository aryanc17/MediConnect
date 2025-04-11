const express = require('express');
const { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post('/login', loginController);

//REGISTER || POST
router.post('/register', registerController);

//Auth || POST
router.post('/getUserData', authMiddleware, authController);

//Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

//All Notification Doctor || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);

//Delete All Notification Doctor || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//GET ALL DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//Book Appointment 
router.post('/book-appointment', authMiddleware, bookAppointmentController);

module.exports = router;