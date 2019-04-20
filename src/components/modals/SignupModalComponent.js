import React, { Component } from 'react';
import { ModalBody, Label, Col, Form, FormGroup, FormFeedback, Input, Button } from 'reactstrap';
import { minLength, maxLength, validEmail, validPassword, required } from '../../utils/validators';
import ClosableModal from '../modals/ClosableModalComponent';
import UnclosableModal from '../modals/UnclosableModalComponent';

class SignupModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getDefaultState() {
        return {
            ...this.getDefaultErrors(),
            signupLoading: false,
            errors: this.getDefaultErrors()
        };
    }

    getDefaultErrors() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    toggleModal() {
        this.setState(this.getDefaultState());
        this.props.toggleModal();
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        let errors = this.getDefaultErrors();

        let error = false;
        if (!minLength(8)(this.state.username) || !maxLength(50)(this.state.username)) {
            errors.username = 'Username must be between 8 and 50 characters.';
            error = true;
        }

        if (!required(this.state.email)) {
            errors.email = 'Please enter your email address.';
            error = true;
        } else if (!validEmail(this.state.email)) {
            errors.email = 'Email has an invalid format.';
            error = true;
        }

        if (!minLength(8)(this.state.password) || !maxLength(50)(this.state.password)) {
            errors.password = 'Password must be between 8 and 50 characters.';
            error = true;
        }

        if (!validPassword(this.state.password)) {
            if (errors.password !== '') {
                errors.password += ' ';
            }
            errors.password += 'Password must contain an uppercase letter, a lowercase letter, a number, and a symbol.';
            error = true;
        }

        if (this.state.confirmPassword !== this.state.password) {
            errors.confirmPassword = 'Passwords must match.';
            error = true;
        }

        this.setState({
            errors: { ...errors }
        });

        if (!error) {
            this.setState({ signupLoading: true });

            setTimeout(() => {
                const existingUser = this.props.users.find(user => user.username === this.state.username);
                if (existingUser) {
                    this.setState({ 
                        signupLoading: false,
                        errors: {
                            ...this.getDefaultErrors(),
                            username: 'Username not allowed.'
                        }
                    })
                } else {
                    this.props.postSignup({ 
                        username: this.state.username,
                        email: this.state.email
                     });
                     this.toggleModal();
                }
            }, 2000);
        }

        event.preventDefault();
    }

    renderForm() {
        return (
            <ModalBody>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="username">Username</Label>
                            <Input type="text"
                                id="username" 
                                name="username"
                                value={this.state.username}
                                disabled={this.state.signupLoading}
                                invalid={this.state.errors.username !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.username}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="email">Email</Label>
                            <Input type="text"
                                id="email" 
                                name="email"
                                value={this.state.email}
                                disabled={this.state.signupLoading}
                                invalid={this.state.errors.email !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.email}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" 
                                id="password" 
                                name="password"
                                value={this.state.password}
                                disabled={this.state.signupLoading}
                                invalid={this.state.errors.password !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.password}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input type="password" 
                                id="confirmPassword" 
                                name="confirmPassword"
                                value={this.state.confirmPassword}
                                disabled={this.state.signupLoading}
                                invalid={this.state.errors.confirmPassword !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.confirmPassword}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="justify-content-end">
                        <Col xs="auto">
                            <Button className="mr-1" onClick={this.toggleModal} disabled={this.state.signupLoading}>Cancel</Button>
                            <Button type="submit" color="success" disabled={this.state.signupLoading}>Login</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
        );
    }

    render() {
        const title = 'Signup';
        if (this.state.signupLoading) {
            return (
                <UnclosableModal title={title} isModalOpen={this.props.isModalOpen}>
                    {this.renderForm()}
                </UnclosableModal>
            )
        } else {
            return (
                <ClosableModal title={title} isModalOpen={this.props.isModalOpen} toggleModal={this.toggleModal}>
                    {this.renderForm()}
                </ClosableModal>
            );
        }
    }
}

export default SignupModal;