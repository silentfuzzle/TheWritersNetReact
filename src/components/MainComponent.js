import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './pages/HomeComponent';
import Library from './pages/LibraryComponent';
import MyLibrary from './pages/MyLibraryComponent';
import ViewBook from './pages/ViewBookComponent';
import EditBook from './pages/EditBookComponent';
import EditPage from './pages/EditPageComponent';
import ViewProfile from './pages/ViewProfileComponent';
import EditProfile from './pages/EditProfileComponent';
import SignupModal from './modals/SignupModalComponent';
import LoginModal from './modals/LoginModalComponent';
import MarkdownModal from './modals/MarkdownModalComponent';
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

const ViewBookFromId = ({match, toggleReviewModal}) => {
    return (
        <ViewBook 
            bookid={parseInt(match.params.id, 10)} 
            toggleReviewModal={toggleReviewModal} 
            />
    );
};

const EditBookFromId = ({match, toggleMarkdownModal}) => {
    return (
        <EditBook 
            bookid={parseInt(match.params.id, 10)} 
            toggleMarkdownModal={toggleMarkdownModal}
            />
    );
};

const EditPageFromId = ({match}) => {
    return (
        <EditPage pageid={parseInt(match.params.id, 10)} />
    );
};

const ViewProfileFromId = ({match}) => {
    return (
        <ViewProfile userid={parseInt(match.params.id, 10)} />
    );
};

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignupOpen: false,
            isLoginOpen: false,
            isMarkdownOpen: false,
            reviewModal: {
                isReviewOpen: false,
                loadingReview: false,
                errMess: '',
                initialState: {
                    'rating': '1',
                    'title': '',
                    'review': ''
                }
            }
        };

        this.toggleSignupModal = this.toggleSignupModal.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleMarkdownModal = this.toggleMarkdownModal.bind(this);
        this.toggleReviewModal = this.toggleReviewModal.bind(this);
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

    toggleMarkdownModal() {
        this.setState({
            isMarkdownOpen: !this.state.isMarkdownOpen
        });
    }

    toggleReviewModal(reviewid = 0) {
        this.setState({
            reviewModal: {
                isReviewOpen: !this.state.reviewModal.isReviewOpen,
                loadingReview: reviewid !== 0,
                errMess: '',
                initialState: {
                    'rating': '1',
                    'title': '',
                    'review': ''
                }
            }
        });

        if (reviewid !== 0) {
            // Database call here
            setTimeout(() => {
                const review = this.props.reviews.find(r => r.id === reviewid);

                this.setState({
                    reviewModal: {
                        ...this.state.reviewModal,
                        loadingReview: false,
                        initialState: {
                            'rating': review.rating,
                            'title': review.title,
                            'review': review.review
                        }
                    }
                })
            }, 2000);
        }
    }

    render() {

        return (
            <React.Fragment>
                <SignupModal 
                    isModalOpen={this.state.isSignupOpen} 
                    toggleModal={this.toggleSignupModal} 
                    postSignup={this.props.postSignup}
                    users={this.props.users} />
                <LoginModal 
                    isModalOpen={this.state.isLoginOpen}
                    toggleModal={this.toggleLoginModal}
                    postLogin={this.props.postLogin}
                    users={this.props.users} />
                <ReviewModal 
                    isModalOpen={this.state.reviewModal.isReviewOpen}
                    toggleModal={this.toggleReviewModal}
                    reviewLoading={this.state.reviewModal.loadingReview}
                    initialState={this.state.reviewModal.initialState} />
                <MarkdownModal 
                    isModalOpen={this.state.isMarkdownOpen}
                    toggleModal={this.toggleMarkdownModal}
                    />

                <Header user={this.props.login.user} 
                    toggleSignupModal={this.toggleSignupModal}
                    toggleLoginModal={this.toggleLoginModal} />
                <Switch>
                    <Route exact path="/" render={() => <Home toggleSignupModal={this.toggleSignupModal} />} />
                    <Route path="/library" component={Library} />
                    <Route path="/mylibrary" render={() => <MyLibrary toggleReviewModal={this.toggleReviewModal} />} />
                    <Route path="/book/:id/edit" render={(props) => <EditBookFromId toggleMarkdownModal={this.toggleMarkdownModal} {...props} />} />
                    <Route path="/book/:id" render={(props) => <ViewBookFromId toggleReviewModal={this.toggleReviewModal} {...props} />} />
                    <Route path="/page/:id/edit" render={(props) => <EditPageFromId {...props} />} />
                    <Route path="/profile/edit" render={() => <EditProfile toggleMarkdownModal={this.toggleMarkdownModal} />} />
                    <Route path="/profile/:id" render={(props) => <ViewProfileFromId {...props} />} />
                    <Redirect to="/" />
                </Switch>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));