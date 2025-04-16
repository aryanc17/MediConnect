import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { message, Table } from 'antd';
import Layout from '../../components/Layout';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/doctor/doctor-appointments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post('/api/v1/doctor/update-status', { appointmentsId: record._id, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong!!');
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id'
        },


        {
            title: 'Date & Time',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                    {dayjs(record.date).format("DD-MM-YYYY")} &nbsp;
                    {dayjs(record.time).format("HH:mm")}
                </span>
            )
        },

        {
            title: 'Status',
            dataIndex: 'status'
        },

        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>
                    <div className="d-flex">
                        {record.status === "pending" && (
                            <div className="d-flex">
                                <button className="btn btn-success ms-2" onClick={() => handleStatus(record, "approved")}>Accept</button>
                                <button className="btn btn-danger ms-2" onClick={() => handleStatus(record, "reject")}>Reject</button>
                            </div>
                        )}
                    </div>
                </span>
            )
        },


    ]

    return (
        <Layout>
            <h1>Appointments List</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default DoctorAppointments


