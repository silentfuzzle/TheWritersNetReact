import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './pages/HomeComponent';
import Library from './pages/LibraryComponent';
import MyLibrary from './pages/MyLibraryComponent';
import SignupModal from './modals/SignupModalComponent';
import LoginModal from './modals/LoginModalComponent';
import ReviewModal from './modals/ReviewModalComponent';
import { addLogin, postSignup } from '../redux/loginReducer';

const mapStateToProps = state => {
    // With an actual database, users and reviews would not be necessary here
    return {
        login: state.login,
        users: state.users,
        reviews: state.reviews
    };
};

const mapDispatchToProps = (dispatch) => ({
    postLogout: () => dispatch(addLogin(null)),
    postLogin: (user) => dispatch(addLogin(user)),
    postSignup: (user) => dispatch(postSignup(user))
});

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignupOpen: false,
            isLoginOpen: false,
            isReviewOpen: false,
            selectedReview: 0
        };

        this.toggleSignupModal = this.toggleSignupModal.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleReviewModal = this.toggleReviewModal.bind(this);
        this.getInitialReviewState = this.getInitialReviewState.bind(this);
    }

    toggleSignupModal() {
        this.setState({
            isSignupOpen: !this.state.isSignupOpen
        });
    }

    toggleLoginModal() {
        this.setState({
            isLoginOpen: !this.state.isLoginOpen
        });
    }

    toggleReviewModal(reviewid = 0) {
        this.setState({
            isReviewOpen: !this.state.isReviewOpen,
            selectedReview: reviewid
        });
    }

    getInitialReviewState() {
        const review = this.props.reviews.find(r => r.id === this.state.selectedReview);
        if (this.state.selectedReview !== 0) {
            return {
                'rating': review.rating,
                'title': review.title,
                'review': review.review
            };
        } else {
            return {
                'rating': '1',
                'title': '',
                'review': ''
            };
        }
    }

    render() {
        return (
            <React.Fragment>
                <SignupModal isModalOpen={this.state.isSignupOpen} 
                    toggleModal={this.toggleSignupModal} 
                    postSignup={this.props.postSignup}
                    users={this.props.users} />
                <LoginModal isModalOpen={this.state.isLoginOpen}
                    toggleModal={this.toggleLoginModal}
                    postLogin={this.props.postLogin}
                    users={this.props.users} />
                <ReviewModal isModalOpen={this.state.isReviewOpen}
                    toggleModal={this.toggleReviewModal}
                    getInitialState={this.getInitialReviewState} />
                <Header user={this.props.login.user} 
                    toggleSignupModal={this.toggleSignupModal}
                    toggleLoginModal={this.toggleLoginModal} />
                <Switch>
                    <Route exact path="/" render={() => <Home toggleSignupModal={this.toggleSignupModal} />} />
                    <Route path="/library" component={Library} />
                    <Route path="/mylibrary" render={() => <MyLibrary toggleReviewModal={this.toggleReviewModal} />} />
                    <Redirect to="/" />
                </Switch>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));