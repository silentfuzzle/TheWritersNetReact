import React, { Component } from 'react';
import { ModalBody, Label, Col, Form, FormGroup, FormFeedback, Input, Button } from 'reactstrap';
import { required } from '../../utils/validators';
import ClosableModal from '../modals/ClosableModalComponent';
import UnclosableModal from '../modals/UnclosableModalComponent';

class LoginModal extends Component {
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
            loginLoading: false,
            errors: this.getDefaultErrors()
        };
    }

    getDefaultErrors() {
        return {
            username: '',
            password: ''
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
        if (!required(this.state.username)) {
            errors.username = 'Please enter your username.';
            error = true;
        }

        if (!required(this.state.password)) {
            errors.password = 'Please enter your password.';
            error = true;
        }

        this.setState({
            errors: { ...errors }
        });

        if (!error) {
            this.setState({
                loginLoading: true
            });

            setTimeout(() => {
                let userFound = false;

                const existingUser = this.props.users.find(user => user.username === this.state.username);
                if (existingUser) {
                    if (existingUser.hashedpassword === this.state.password) {
                        this.props.postLogin(existingUser);
                        this.toggleModal();
                        userFound = true;
                    }
                }

                if (!userFound) {
                    this.setState({
                        loginLoading: false,
                        errors: {
                            ...this.getDefaultErrors(),
                            password: 'Username and password combination not found.'
                        }
                    });
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
                                invalid={this.state.errors.username !== ''}
                                onChange={this.handleChange} />
                            <FormFeedback>{this.state.errors.username}</FormFeedback>
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
                    <FormGroup row className="justify-content-end">
                        <Col xs="auto">
                            <Button className="mr-1" onClick={this.toggleModal} disabled={this.state.loginLoading}>Cancel</Button>
                            <Button type="submit" color="success" disabled={this.state.loginLoading}>Login</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
        );
    }

    render() {
        const title = 'Login';
        if (this.state.loginLoading) {
            return (
                <UnclosableModal title={title} isModalOpen={this.props.isModalOpen}>
                    {this.renderForm()}
                </UnclosableModal>
            );
        } else {
            return (
                <ClosableModal title={title} isModalOpen={this.props.isModalOpen} toggleModal={this.toggleModal}>
                    {this.renderForm()}
                </ClosableModal>
            );
        }
    }
}

export default LoginModal;