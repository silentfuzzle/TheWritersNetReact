import React, { Component } from 'react';
import { Row, Col, Label, Button } from 'reactstrap';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { connect } from 'react-redux';
import { required } from '../../utils/validators';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books
    };
};

class EditBookForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            book: {}
        }
    }

    fetchBook() {
        this.setState({
            isLoading: true,
            errMess: '',
            book: {
                title: '',
                subtitle: '',
                description: '',
                visibility: 'public'
            }
        });

        setTimeout(() => {
            let book = this.props.books.find(book => book.id === this.props.bookid);

            this.setState({
                isLoading: false,
                errMess: '',
                book: book
            });
        }, 2000);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    componentDidMount() {
        this.fetchBook();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Book...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        return (
            <LocalForm onSubmit={this.handleSubmit} initialState={this.state.book}>
                <Row className="form-group">
                    <Col>
                        <Label for="title">Title</Label>
                        <Control.text 
                            model=".title" 
                            className="form-control form-control-sm mr-1" 
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
                <Row className="form-group">
                    <Col>
                        <Label for="subtitle">Short Description</Label>
                        <Control.text 
                            model=".subtitle"
                            className="form-control form-control-sm mr-1"
                            id="subtitle"
                            name="subtitle"
                            validators={{ required }}
                            />
                        <Errors 
                            className="text-danger" 
                            model=".subtitle" 
                            show="touched" 
                            messages={{ required: 'Required' }}
                            />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col>
                        <Label for="description">Description</Label>
                        <Control.textarea
                            model=".description"
                            className="form-control form-control-sm mr-1"
                            id="description"
                            name="description"
                            rows="5"
                            validators={{ required }}
                            />
                        <Errors 
                            className="text-danger" 
                            model=".description" 
                            show="touched" 
                            messages={{ required: 'Required' }}
                            />
                        <Button color="link" onClick={this.props.toggleMarkdownModal}>Markdown Help</Button>
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col>
                        <Label for="visibility">Visibility</Label>
                        <div className="form-check">
                            <Control.radio
                                model=".visibility"
                                className="form-check-input"
                                name="visibility"
                                id="visibility"
                                value="public"
                                defaultValue="public"
                                />
                            <Label className="form-check-label" for="public">
                                Public (Anyone can view this book)
                            </Label>
                        </div>
                        <div className="form-check">
                            <Control.radio
                                model=".visibility"
                                className="form-check-input"
                                name="visibility"
                                id="visibility"
                                value="private"
                                />
                            <Label className="form-check-label" for="private">
                                Private (You choose who can view this book)
                            </Label>
                        </div>
                    </Col>
                </Row>
                <Row className="form-group row justify-content-end">
                    <Col xs="auto">
                        <Button color="success">Save</Button>
                    </Col>
                </Row>
            </LocalForm>
        );
    }
}

export default connect(mapStateToProps)(EditBookForm);