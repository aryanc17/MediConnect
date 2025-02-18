import React from 'react';
import '../styles/LoginStyles.css';
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const onFinishHandler = async (values) => {
        try {
            const res = await axios.post("/api/v1/user/login", values);
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                message.success("Login Successfully!!");
                navigate("/");
            }
            else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong!!')
        }
    }
    return (
        <div className="form-container">
            <Form layout="vertical" onFinish={onFinishHandler} className='login-form'>
                <h3 className='text-center'>Login Form</h3>
                <Form.Item label="Email" name="email">
                    <input type="email" required />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <input type="password" required />
                </Form.Item>
                <Link to='/register' className='m-2'>Not a user? Login here</Link>
                <button className="btn btn-primary" type='submit'>Login</button>
            </Form>
        </div>
    )
}

export default Login
