const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).send({
            success: true,
            message: 'Users data list',
            data: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while fetching users',
            error
        })
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: 'Doctors data list',
            data: doctors
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting doctors data',
            error
        })
    }
}

//Doctor Account status ctrl
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your Doctor Account Request Has ${status}`,
            onClickPath: '/notification'
        })
        user.isDoctor = status === "approved" ? true : false;
        await user.save();
        res.status(201).send({
            success: true,
            message: 'Account status updated',
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Account Status'
        })
    }
}

module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController };