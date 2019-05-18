import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Label, Row, Col, Form, FormGroup, FormFeedback, Input, Button } from 'reactstrap';
import { minLength, maxLength, validEmail, validPassword, required } from '../../utils/validators';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        users: state.users,
        user: state.login.user
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getDefaultState() {
        return {
            ...this.getDefaultErrors(),
            email: this.props.user.email,
            updatingEmail: false,
            updatingPassword: false,
            errors: this.getDefaultErrors()
        };
    }

    getDefaultErrors() {
        return {
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleEmail(event) {
        let errors = this.getDefaultErrors();

        let error = false;
        if (!required(this.state.email)) {
            errors.email = 'Please enter your email address.';
            error = true;
        } else if (!validEmail(this.state.email)) {
            errors.email = 'Email has an invalid format.';
            error = true;
        }

        this.setState({
            errors: { ...errors }
        });

        if (!error) {
            this.setState({ updatingEmail: true });

            setTimeout(() => {
                console.log('Update email to ' + this.state.email);
                this.setState({ updatingEmail: false });
            }, 2000);
        }

        event.preventDefault();
    }

    handlePassword(event) {
        let errors = this.getDefaultErrors();

        let error = false;
        if (!required(this.state.currentPassword)) {
            errors.currentPassword = 'Please enter your current password.';
            error = true;
        }

        if (!minLength(8)(this.state.newPassword) || !maxLength(50)(this.state.newPassword)) {
            errors.newPassword = 'Password must be between 8 and 50 characters.';
            error = true;
        }

        if (!validPassword(this.state.newPassword)) {
            if (errors.newPassword !== '') {
                errors.newPassword += ' ';
            }
            errors.newPassword += 'Password must contain an uppercase letter, a lowercase letter, a number, and a symbol.';
            error = true;
        }

        if (this.state.confirmPassword !== this.state.newPassword) {
            errors.confirmPassword = 'Passwords must match.';
            error = true;
        }

        this.setState({
            errors: { ...errors }
        });

        if (!error) {
            this.setState({ updatingPassword: true });

            setTimeout(() => {
                const existingUser = this.props.users.find(user => user.id === this.props.user.id);

                if (this.state.currentPassword === existingUser.hashedpassword) {
                    console.log('Update password to ' + this.state.newPassword);
                    this.setState({ updatingPassword: false });
                } else {
                    this.setState({
                        updatingPassword: false,
                        errors: {
                            ...this.state.errors,
                            currentPassword: 'Password is incorrect.'
                        }
                    });
                }
            }, 2000);
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <Row>
                    <Col xs={12}>
                        <h1>Settings</h1>
                    </Col>
                    <Col>
                        <h2>Change Email</h2>
                    </Col>
                </Row>
                <Form onSubmit={this.handleEmail}>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="email">Email</Label>
                            <Input type="text"
                                id="email" 
                                name="email"
                                value={this.state.email}
                                disabled={this.state.updatingEmail}
                                invalid={this.state.errors.email !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.email}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="justify-content-end">
                        <Col xs="auto">
                            <Button type="submit" color="success" disabled={this.state.updatingEmail}>Save</Button>
                        </Col>
                    </FormGroup>
                </Form>
                <Row>
                    <Col>
                        <h2>Change Password</h2>
                    </Col>
                </Row>
                <Form onSubmit={this.handlePassword}>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input type="password" 
                                id="currentPassword" 
                                name="currentPassword"
                                value={this.state.currentPassword}
                                disabled={this.state.updatingPassword}
                                invalid={this.state.errors.currentPassword !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.currentPassword}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input type="password" 
                                id="newPassword" 
                                name="newPassword"
                                value={this.state.newPassword}
                                disabled={this.state.updatingPassword}
                                invalid={this.state.errors.newPassword !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.newPassword}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input type="password" 
                                id="confirmPassword" 
                                name="confirmPassword"
                                value={this.state.confirmPassword}
                                disabled={this.state.updatingPassword}
                                invalid={this.state.errors.confirmPassword !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.confirmPassword}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="justify-content-end">
                        <Col xs="auto">
                            <Button type="submit" color="success" disabled={this.state.updatingPassword}>Save</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Settings);