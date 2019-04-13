import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, FormFeedback, Input, Button } from 'reactstrap';
import { required } from '../../utils/validators';

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
            console.log("Current State is: " + JSON.stringify(this.state));
            alert("Current State is: " + JSON.stringify(this.state));
        }

        event.preventDefault();
    }

    render() {
        return (
            <Modal isOpen={this.props.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
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

export default LoginModal;