import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Label, Button } from 'reactstrap';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { connect } from 'react-redux';
import { required } from '../../utils/validators';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        users: state.users,
        user: state.login.user
    };
};

class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            profile: {}
        }
    }

    fetchProfile() {
        this.setState({
            isLoading: true,
            errMess: '',
            profile: {}
        });

        setTimeout(() => {
            const profile = this.props.users.find(u => u.id === this.props.user.id);

            this.setState({
                isLoading: false,
                errMess: '',
                profile: profile
            });
        }, 2000);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    componentDidMount() {
        this.fetchProfile();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Profile...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        const labelClass = "col-12 col-sm-3 col-md-3 col-lg-2 col-form-label";
        const valueClass = "col-12 col-sm-9 col-md-9 col-lg-6";

        return (
            <div className="container">
                <Row>
                    <Col>
                        <h1>Edit Profile</h1>
                    </Col>
                </Row>
                <LocalForm onSubmit={this.handleSubmit} initialState={this.state.profile}>
                    <Row className="form-group">
                        <Label className={labelClass} for="displayname">Display Name</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".displayname" 
                                className="form-control" 
                                id="displayname"
                                name="displayname"
                                validators={{ required }}
                                />
                            <Errors 
                                className="text-danger"
                                model=".displayname" 
                                show="touched" 
                                messages={{ required: 'Required' }}
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Label className={labelClass} for="facebook">Facebook</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".facebook" 
                                className="form-control" 
                                id="facebook"
                                name="facebook"
                                placeholder="facebook.profile.name"
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Label className={labelClass} for="linkedin">LinkedIn</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".linkedin" 
                                className="form-control" 
                                id="linkedin"
                                name="linkedin"
                                placeholder="linkedin-profile-name"
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Label className={labelClass} for="twitter">Twitter</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".twitter" 
                                className="form-control" 
                                id="twitter"
                                name="twitter"
                                placeholder="TwitterHandle"
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Label className={labelClass} for="youtube">YouTube</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".youtube" 
                                className="form-control" 
                                id="youtube"
                                name="youtube"
                                placeholder="YouTubeChannelName"
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Label className={labelClass} for="website">Website</Label>
                        <div className={valueClass}>
                            <Control.text 
                                model=".website" 
                                className="form-control" 
                                id="website"
                                name="website"
                                placeholder="http://yourwebsite.com"
                                />
                        </div>
                    </Row>
                    <Row className="form-group">
                        <Col>
                            <Label for="about">About</Label>
                            <Control.textarea
                                model=".about"
                                className="form-control mr-1"
                                id="about"
                                name="about"
                                rows="5"
                                />
                            <Button color="link" onClick={this.props.toggleMarkdownModal}>Markdown Help</Button>
                        </Col>
                    </Row>
                    <Row className="form-group justify-content-end">
                        <Col xs="auto">
                            <Link className="btn btn-success mr-2" to={`/profile/${this.props.profileid}`}>View Profile</Link>
                            <Button color="success">Save</Button>
                        </Col>
                    </Row>
                </LocalForm>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EditProfile);