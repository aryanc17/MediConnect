const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Doctor data fetched successfully',
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while fetching Doctor details"
        })
    }
}

const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: 'Doctor Profile Updated',
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Doctor Profile Update issue'
        })
    }
}

// Get single doctor info
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: 'Single Doctor Info fetched',
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting Single doctor info'
        })
    }
}

//Get Appintments
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorId: doctor._id });
        res.status(200).send({
            success: true,
            message: 'Doctor Appointments fetched successfully!!',
            data: appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting doctor appointments'
        })
    }
}

//update status
const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            { status }
        );
        const user = await userModel.findOne({ _id: appointments.userId });
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `your appointment has been updated ${status}`,
            onCLickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Updating Status",
        });
    }
};


module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController };