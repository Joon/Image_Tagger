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
        let { fname, password, email } = values;

        // show loader
        this.setState({ loading: true });

        Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name: fname 
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

    validateMessages = {
        types: {
            // eslint-disable-next-line
            email: '${label} is not a valid email!'              
        }
    };

    render() {
        const { redirect, loading } = this.state;

        return (
        <React.Fragment>
            <Form onFinish={this.onFinish} ref={this.formRef} validateMessages={this.validateMessages}>
                <Form.Item
                    label="Name"
                    name="fname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}>
                    <Input
                        placeholder="Name"
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: 'email',
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

