const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        doctorId: {
            type: String,
            required: true,
        },
        doctorInfo: {
            type: String,
            required: true,
        },
        userInfo: {
            type: String,
            required: true,
        },
        date: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "pending",
        },
        time: {
            type: Object,
            required: true,
        }
    },
    { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;