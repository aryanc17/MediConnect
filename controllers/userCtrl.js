const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
dayjs.extend(customParseFormat);
dayjs.extend(utc);

//Register controller
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: `User Already Exists`, success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Register Successfully", success: true });
    } catch (error) {
        console.log(error);
        res.send(500).send({ success: false, message: `Register controller ${error.message}` })
    }
}

//Login Controller
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(200).send({ message: "Invalid Email or Password", success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.status(200).send({ message: "Login Successfully", success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login Controller ${error.message}` })
    }
}


const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false })
        }
        else {
            res.status(200).send({
                success: true, data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth error',
            success: false,
            error
        })
    }
}

//Apply Doctor Controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;

        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully!!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while applying for doctor',
            success: false,
            error,
        })
    }
};

//Notification Controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const seenNotification = user.seenNotification;
        const notification = user.notification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = notification;

        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notifications mark as read",
            data: updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in notification"
        })
    }
}

//Delete Notification
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seenNotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notifications deleted successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to delete all notifications",
            error,
        });
    }
}

//GET ALL DOCTORS controller
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: "Doctors list fetched successfully",
            data: doctors
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while fetching all doctors list'
        })
    }
}

//Book Appointment
const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = dayjs(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = dayjs(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
        user.notification.push({
            type: "New-appointment-request",
            message: `A new Appointment request from ${req.body.userInfo.name}`,
            onClickPath: "/user/appointments"
        })
        await user.save();

        res.status(200).send({
            success: true,
            message: "Appointment Booked Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Booking Appointment'
        })
    }
}

//Booking Availability
const bookingAvailabilityController = async (req, res) => {
    try {
        const date = dayjs(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = dayjs(req.body.time, "HH:mm")
            .subtract(1, "hour")
            .toISOString();
        const toTime = dayjs(req.body.time, "HH:mm")
            .add(1, "hour")
            .toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime, $lte: toTime
            }
        })
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not available this time",
                success: true
            })
        }
        else {
            return res.status(200).send({
                message: "Appointments available",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            error,
            message: "Error in booking availability"
        })
    }
}

//User Appointments
const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: "User appointments fetched successfully!!",
            data: appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting user appointments"
        })
    }
}

module.exports = { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController }; 