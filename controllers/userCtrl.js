const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');

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


module.exports = { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController }; 