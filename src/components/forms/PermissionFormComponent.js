import React, { Component } from 'react';
import { Label, Row, Col, Form, FormFeedback, Input, Button } from 'reactstrap';
import { required } from '../../utils/validators';

class PermissionForm extends Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getDefaultState() {
        return {
            ...this.getDefaultErrors(),
            permission: 1,
            isLoading: false,
            errors: this.getDefaultErrors()
        };
    }

    getDefaultErrors() {
        return {
            username: ''
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

    handleSubmit(event) {
        let errors = this.getDefaultErrors();

        let error = false;
        if (!required(this.state.username)) {
            errors.username = 'Please enter a username or display name.';
            error = true;
        }

        this.setState({
            errors: { ...errors }
        });

        if (!error) {
            this.setState({
                isLoading: true
            });

            setTimeout(() => {
                const existingUser = this.props.users.find(user => user.username === this.state.username || user.displayname === this.state.username);
                if (existingUser) {
                    this.setState({
                        isLoading: false,
                        errors: {
                            ...this.getDefaultErrors()
                        },
                        username: existingUser.username + ' (' + existingUser.displayname + ')'
                    });
                    this.props.addPermission(existingUser.id, this.state.permission);
                } else {
                    this.setState({
                        isLoading: false,
                        errors: {
                            ...this.getDefaultErrors(),
                            username: 'User not found.'
                        }
                    });
                }
            }, 2000);
        }

        event.preventDefault();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Searching users...</h4>
            );
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row className="justify-content-between">
                    <Col xs={6} className="form-group">
                        <Label className="sr-only" for="username">Username</Label>
                        <Input 
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username or Display Name"
                            value={this.state.username}
                            invalid={this.state.errors.username !== ''}
                            onChange={this.handleChange}
                            />
                        <FormFeedback>{this.state.errors.username}</FormFeedback>
                    </Col>
                    <Col xs={'auto'} className="form-group">
                        <Label className="sr-only" for="permission">Permission</Label>
                        <select 
                            className="form-control"
                            id="permission"
                            name="permission"
                            value={this.state.permission} 
                            onChange={this.handleChange}
                            >
                            {
                                this.props.permissionTypes.map(pt => {
                                    return (<option key={pt.id} value={pt.id}>{pt.name}</option>);
                                })
                            }
                        </select>
                    </Col>
                    <Col xs={12} md={'auto'}>
                        <Button color="success">Add Permission</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default PermissionForm;