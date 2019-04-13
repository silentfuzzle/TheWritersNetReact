import React, { Component } from 'react';
import { Button } from 'reactstrap';
import LoginModal from '../modals/LoginModalComponent';

class LoginOrSignup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoginOpen: false
        };

        this.toggleLoginModal = this.toggleLoginModal.bind(this);
    }

    toggleLoginModal() {
        this.setState({
            isLoginOpen: !this.state.isLoginOpen
        });
    }

    render() {
        return (
            <React.Fragment>
                <LoginModal isModalOpen={this.state.isLoginOpen} toggleModal={this.toggleLoginModal} />
                <Button color="success" onClick={this.toggleLoginModal}>Login</Button>
                <span className="navbar-text text-white p-2"> or </span>
                <Button color="success" onClick={this.props.toggleSignupModal}>Signup</Button>
            </React.Fragment>
        );
    }
}

export default LoginOrSignup;