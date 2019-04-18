import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Label, Row, Col, Button } from 'reactstrap';
import { Control, LocalForm } from 'react-redux-form';

class ReviewModal extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    render() {
        return (
            <Modal isOpen={this.props.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={this.handleSubmit}>
                        <Row className="form-group">
                            <Col>
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" name="rating" 
                                        className="form-control" defaultValue="1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                                <Label htmlFor="title">Review Title (Optional)</Label>
                                <Control.text model=".title" id="title" name="title" 
                                    placeholder="Review Title" 
                                    className="form-control" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                                <Label htmlFor="review">Review (Optional)</Label>
                                <Control.textarea model=".review" id="review" name="review" rows="6" 
                                    className="form-control" />
                            </Col>
                        </Row>
                        <Row className="form-group justify-content-end">
                            <Col xs="auto">
                                <Button className="mr-1" onClick={this.props.toggleModal}>Cancel</Button>
                                <Button type="submit" color="success">Submit</Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
        );
    }
}

export default ReviewModal;