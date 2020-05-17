import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, notification, Input, Col } from 'antd';

// amplify
import { Auth } from 'aws-amplify';

export default class ConfirmRegistration extends Component {
    state = {
       username: '',
        loading: false,
        redirect: false,
        confirmationCode: '',
        error: ''
    };

    componentDidMount() {
        if (this.props.match.params.search) {
            // get username from url params
            this.setState({ username: this.props.match.params.search });
        }
    }

    handleSubmit = (event) => {
        const { confirmationCode } = this.state;

        // show progress spinner
        this.setState({ loading: true });

        Auth.confirmSignUp(this.state.username, confirmationCode)
        .then(() => {
            this.handleOpenNotification('success', 'Succesfully confirmed!', 'You will be redirected to login shortly!');
        })
        .catch(err => {
            this.handleOpenNotification('error', 'Invalid code', err.message);
            this.setState({
            loading: false
            });
        });
    };

    handleOpenNotification = (type, title, message) => {
        if (type === 'success') {
            notification.success({
                message: title,
                description: message,
                placement: 'topRight',
                duration: 1.5,
                onClose: () => {
                    this.setState({ redirect: true });
                }
            });
        } else {
            notification.error({
                message: title,
                description: message,
                placement: 'topRight',
                duration: 1.5
            });
        }
    }

  handleChange = (event) => {
    this.setState({ confirmationCode: event.currentTarget.value });
  };

  render() {
    const { loading, redirect, confirmationCode, error} = this.state;

    return (
        <div>
            <Form onFinish={this.handleSubmit}>
            <Col md={24} lg={18}>
                <div className="full-width">
                <h2>Check your email</h2>
                <p>We've sent a six­ digit confirmation code</p>
                </div>
                <Form.Item validateStatus={error && 'error'} help={error} label="Confirmation Code">
                <Input
                    size="large"
                    type="number"
                    placeholder="Enter confirmation code"
                    onChange={this.handleChange}
                    value={confirmationCode}
                />
                </Form.Item>
            </Col>
            <Col md={24} lg={12}>
                <Button type="primary" disabled={loading} htmlType="submit" size="large">
                    {loading ? "Processing..." : 'Confirm Email'}
                </Button>
            </Col>
            </Form>
            {redirect && <Redirect to={{ pathname: '/login' }} />}
        </div>
    );
  }
}