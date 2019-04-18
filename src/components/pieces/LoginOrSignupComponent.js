import React, { Component } from 'react';
import { Button } from 'reactstrap';

class LoginOrSignup extends Component {
    render() {
        return (
            <React.Fragment>
                <Button color="success" onClick={this.props.toggleLoginModal}>Login</Button>
                <span className="navbar-text text-white p-2"> or </span>
                <Button color="success" onClick={this.props.toggleSignupModal}>Signup</Button>
            </React.Fragment>
        );
    }
}

export default LoginOrSignup;