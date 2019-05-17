import React, { Component } from 'react';
import { Label, Row, Col, Button } from 'reactstrap';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { connect } from 'react-redux';
import { required } from '../../utils/validators';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        pages: state.pages
    };
};

class EditPageForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            page: {}
        }
    }

    fetchPage() {
        this.setState({
            isLoading: true,
            errMess: '',
            page: {
                id: 0,
                title: ''
            }
        });

        setTimeout(() => {
            const page = this.props.pages.find(p => p.id === this.props.pageid);

            this.setState({
                isLoading: false,
                errMess: '',
                page: page
            });
        }, 2000);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    componentDidMount() {
        this.fetchPage();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Page...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        return (
            <LocalForm onSubmit={this.handleSubmit} initialState={this.state.page}>
                <Row className="form-group">
                    <Col>
                        <Label for="title">Title</Label>
                        <Control.text 
                            model=".title" 
                            className="form-control mr-1" 
                            id="title"
                            name="title"
                            validators={{ required }}
                            />
                        <Errors 
                            className="text-danger" 
                            model=".title" 
                            show="touched" 
                            messages={{ required: 'Required' }}
                            />
                    </Col>
                </Row>
                <Row className="form-group justify-content-end">
                    <Col xs="auto">
                        <Button color="success">Save</Button>
                    </Col>
                </Row>
            </LocalForm>
        );
    }
}

export default connect(mapStateToProps)(EditPageForm);