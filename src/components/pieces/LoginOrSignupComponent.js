import React, { Component } from 'react';
import { Button } from 'reactstrap';
import LoginModal from '../modals/LoginModalComponent';
import SignupModal from '../modals/SignupModalComponent';

class LoginOrSignup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoginOpen: false,
            isSignupOpen: false
        };

        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleSignupModal = this.toggleSignupModal.bind(this);
    }

    toggleLoginModal() {
        this.setState({
            isLoginOpen: !this.state.isLoginOpen
        });
    }

    toggleSignupModal() {
        this.setState({
            isSignupOpen: !this.state.isSignupOpen
        });
    }

    render() {
        return (
            <React.Fragment>
                <LoginModal isModalOpen={this.state.isLoginOpen} toggleModal={this.toggleLoginModal} />
                <SignupModal isModalOpen={this.state.isSignupOpen} toggleModal={this.toggleSignupModal} />
                <span className="navbar-text">
                    <Button color="success" onClick={this.toggleLoginModal}>Login</Button>
                </span>
                <span className="navbar-text text-white p-2"> or </span>
                <span className="navbar-text">
                    <Button color="success" onClick={this.toggleSignupModal}>Signup</Button>
                </span>
            </React.Fragment>
        );
    }
}

export default LoginOrSignup;