import React from 'react';
import '../styles/RegisterStyles.css'
import axios from 'axios';
import { Form, message } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { Link, useNavigate } from 'react-router-dom'


const Register = () => {
    const navigate = useNavigate();
    const onFinishHandler = async (values) => {
        try {
            const res = await axios.post('/api/v1/user/register', values);
            if (res.data.success) {
                message.success('Register Successfully!');
                navigate('/login');
            }
            else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong')
        }
    }
    return (
        <>
            <div className="form-container">
                <Form layout="vertical" onFinish={onFinishHandler} className='register-form'>
                    <h3 className='text-center'>Registration Form</h3>
                    <Form.Item label="Name" name="name">
                        <input type="text" value="" required />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <input type="email" required />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <input type="password" required />
                    </Form.Item>
                    <Link to='/login' className='m-2'>Already user? Login here</Link>
                    <button className="btn btn-primary" type='submit'>Register</button>
                </Form>
            </div>
        </>
    )
}

export default Register
