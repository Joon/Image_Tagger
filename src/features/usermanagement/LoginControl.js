import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Form, Spin, Input, Button, notification, Col, Row } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { setSelectedUser } from '../queue/queueSlice';
import { connect } from 'react-redux';

class LoginContainerInternal extends Component {
    state = {
        loading: false
    };

    handleSubmit = (values) => {
        let { username, password } = values;

        this.setState({ loading: true });

        Auth.signIn(username, password)
            .then(user => {
                const { history, location } = this.props;
                const { from } = location.state || {
                    from: {
                        pathname: '/'
                    }
                };

                localStorage.setItem('AUTH_USER_TOKEN_KEY', user.signInUserSession.accessToken.jwtToken);
                this.props.setSelectedUser();

                notification.success({
                    message: 'Succesfully logged in!',
                    description: 'Logged in successfully, Redirecting you shortly!',
                    placement: 'topRight',
                    duration: 1.5,
                    onClose: () => history.push(from)
                });                
            }).catch(err => {
                notification.error({
                    message: 'Error',
                    description: err.message,
                    placement: 'topRight'
                });
                console.log(err);

                this.setState({ loading: false });
            });
    };

    render() {        
        const { loading } = this.state;

        return (
            <div>
                <Form onFinish={this.handleSubmit} className="login-form">
                <Form.Item name="username" rules={                    
                    [
                        {
                        required: true,
                        message: 'Please input your username!'
                        }
                    ]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item name="password" rules= {[
                        {
                        required: true,
                        message: 'Please input your password!'
                        }
                    ]}>                    
                    <Input
                        prefix={<LockOutlined />}
                        type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item className="text-center">
                    <Row type="flex" gutter={16}>
                    <Col lg={24}>
                        <Link style={{ float: 'right' }} className="login-form-forgot" to="/forgot-password">
                        Forgot password
                        </Link>
                    </Col>
                    <Col lg={24}>
                        <Button
                        style={{ width: '100%' }}
                        type="primary"
                        disabled={loading}
                        htmlType="submit"
                        className="login-form-button"
                        >
                        {loading ? <Spin indicator={<LoadingOutlined />} /> : 'Log in'}
                        </Button>
                    </Col>
                    <Col lg={24}>
                        Or <Link to="/signup">register now!</Link>
                    </Col>
                    </Row>
                </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ownProps;
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setSelectedUser: () => {
            dispatch(setSelectedUser())
        }
    }
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginContainerInternal)
export default LoginContainer;