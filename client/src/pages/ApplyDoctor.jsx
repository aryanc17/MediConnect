import React from 'react';
import Layout from './../components/Layout';
import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const ApplyDoctor = () => {
    const { user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/apply-doctor",
                {
                    ...values, userId: user._id, timings: [
                        moment(values.timings[0]).format('HH:mm'),
                        moment(values.timings[1]).format('HH:mm')
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
    return (
        <Layout>
            <h1 className='text-center'>Apply Doctor</h1>
            <Form layout='vertical' onFinish={handleFinish} className='m-4'>
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
                        <button className='btn btn-primary form-btn' type='submit'>Submit</button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor
