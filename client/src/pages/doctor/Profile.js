import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import dayjs from 'dayjs';


const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    //---------------------Update doc---------------------
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/updateProfile",
                {
                    ...values, userId: user._id
                    , timings: [
                        dayjs(values.timings[0]).format('HH:mm'),
                        dayjs(values.timings[1]).format('HH:mm')
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate("/");
            } else {
                message.error(res.data.success);
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong!!");
        }
    }
    //---------------------Update doc---------------------

    //getDoctor info
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post("/api/v1/doctor/getDoctorInfo", { userId: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getDoctorInfo();
        //eslint-disable-next-line
    }, [])
    return (
        <Layout>
            <h1>Manage Profile</h1>
            {doctor && (
                <Form layout='vertical' onFinish={handleFinish} className='m-4' initialValues={{
                    ...doctor
                    , timings: [
                        dayjs(doctor.timings[0], 'HH:mm'),
                        dayjs(doctor.timings[1], 'HH:mm')
                    ]
                }}>
                    <h4 className="">Personal Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="First name" name="firstName" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your first name' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Last name" name="lastName" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your last name' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Phone Number" name="phone" required rules={[{ required: true }]}>
                                <Input type='number' placeholder='Your Phone number' />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Email" name="email" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your email' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Website" name="website"  >
                                <Input type='text' placeholder='Your website' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Address" name="address" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your address' />
                            </FormItem>
                        </Col>
                    </Row>

                    <h4>Professional Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Specialization" name="specialization" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your specialization' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Experience" name="experience" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your experience' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Fee per consultation" name="feesPerConsultaion" required rules={[{ required: true }]}>
                                <Input type='text' placeholder='Your fee per consultation' />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <FormItem label="Timings" name="timings" required >
                                <TimePicker.RangePicker format="hh:mm" />
                            </FormItem>
                        </Col>
                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button className='btn btn-primary form-btn' type='submit'>Update</button>
                        </Col>
                    </Row>
                </Form>

            )}
        </Layout>
    )
}

export default Profile
