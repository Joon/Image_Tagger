import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Form, Input, Button, notification, Col, Row } from 'antd';
import 'antd/dist/antd.css';

export default class SignUpContainer extends Component {    
    formRef = React.createRef();

    state = {
        redirect: false,
        loading: false,
        email: ''
    };

    onFinish = (values) => {    
        let { fname, lname, password, email } = values;

        // show loader
        this.setState({ loading: true });

        Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name: fname + " " + lname
            }
        })
        .then(() => {
            notification.success({
            message: 'Succesfully signed up user!',
            description: 'Account created successfully, Redirecting you in a few!',
            placement: 'topRight',
            duration: 1.5,
            onClose: () => {
                this.setState({ redirect: true });
            }
            });

            this.setState({ email });
        })
        .catch(err => {
            notification.error({
            message: 'Error',
            description: 'Error signing up user '+ err,
            placement: 'topRight',
            duration: 1.5
            });

            this.setState({
            loading: false
            });
        });
    };

    compareToFirstPassword = (rule, value, callback) => {
        let currentPass = this.formRef.current.getFieldValue('password');
        if (value && value !== currentPass) {
            callback('The confirmation password does not match!');
        } else {
            callback();
        }
    };

    render() {
        const { redirect, loading } = this.state;

        return (
        <React.Fragment>
            <Form onFinish={this.onFinish} ref={this.formRef}>
                <Form.Item
                    label="First Name"
                    name="fname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                        },
                    ]}>
                    <Input
                        placeholder="First Name"
                    />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                        },
                    ]}>
                    <Input
                        placeholder="Last Name"
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}>
                    <Input
                        placeholder="email@someplace.co.nz"
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                    <Input
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item 
                    label="Confirm PW"
                    name="confirmpass"
                    rules={[
                        {
                        required: true,
                        message: 'Please confirm your password!'
                        },
                        {
                        validator: this.compareToFirstPassword
                        }
                    ]}>
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        onBlur={this.handleConfirmBlur}
                    />
                </Form.Item>

                <Form.Item className="text-center">
                    <Row>
                    <Col lg={24}>
                        <Button style={{ width: '100%' }} type="primary" disabled={loading} htmlType="submit">
                        {loading ? "Loading..." : 'Register'}
                        </Button>
                    </Col>
                    <Col lg={24}>
                        Or <Link to="/login">login to your account!</Link>
                    </Col>
                    </Row>
                </Form.Item>
            </Form>
            {redirect && (
            <Redirect
                to={{
                    pathname: '/verify-code/' + this.state.email
                }}
            />
            )}
        </React.Fragment>
    );
  }
}

