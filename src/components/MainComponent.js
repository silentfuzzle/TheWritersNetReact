import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './pages/HomeComponent';
import SignupModal from './modals/SignupModalComponent';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignupOpen: false
        };

        this.toggleSignupModal = this.toggleSignupModal.bind(this);
    }

    toggleSignupModal() {
        this.setState({
            isSignupOpen: !this.state.isSignupOpen
        });
    }

    render() {
        return (
            <React.Fragment>
                <SignupModal isModalOpen={this.state.isSignupOpen} toggleModal={this.toggleSignupModal} />
                <Header isLoggedIn={false} toggleSignupModal={this.toggleSignupModal} />
                <Switch>
                    <Route exact path="/" render={() => <Home toggleSignupModal={this.toggleSignupModal} />} />
                    <Redirect to="/" />
                </Switch>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Main;