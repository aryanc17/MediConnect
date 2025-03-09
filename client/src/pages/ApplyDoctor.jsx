import React from 'react';
import Layout from './../components/Layout';
import { Col, Form, Input, Row, TimePicker } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const ApplyDoctor = () => {
    //handle form
    const handleFinish = (values) => {
        console.log(values);
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
                        <FormItem label="Fee per consultation" name="feePerConsultation" required rules={[{ required: true }]}>
                            <Input type='text' placeholder='Your fee per consultation' />
                        </FormItem>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <FormItem label="Timings" name="timings" required >
                            <TimePicker.RangePicker />
                        </FormItem>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <button className='btn btn-primary' type='submit'>Submit</button>
                </div>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor
