import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './pages/HomeComponent';
import Library from './pages/LibraryComponent';
import SignupModal from './modals/SignupModalComponent';
import { postLogin, postLogout, postSignup } from '../redux/loginReducer';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => ({
    postLogin: (username, password) => dispatch(postLogin(username, password)),
    postLogout: () => dispatch(postLogout()),
    postSignup: (user) => dispatch(postSignup(user))
});

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
                    <Route path="/library" component={Library} />
                    <Redirect to="/" />
                </Switch>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));