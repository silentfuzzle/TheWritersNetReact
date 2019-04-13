import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, FormFeedback, Input, Button } from 'reactstrap';
import { minLength, maxLength, validEmail, validPassword, required } from '../../utils/validators';

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
            console.log("Current State is: " + JSON.stringify(this.state));
            alert("Current State is: " + JSON.stringify(this.state));
        }

        event.preventDefault();
    }

    render() {
        return (
            <Modal isOpen={this.props.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Signup</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup row>
                            <Col>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text"
                                    id="username" 
                                    name="username"
                                    value={this.state.username}
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
                                    invalid={this.state.errors.confirmPassword !== ''}
                                    onChange={this.handleChange} />
                                <FormFeedback>{this.state.errors.confirmPassword}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="justify-content-end">
                            <Col xs="auto">
                                <Button className="mr-1" onClick={this.toggleModal}>Cancel</Button>
                                <Button type="submit" color="success">Login</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}

export default SignupModal;