import React, { Component } from 'react';
import { ModalBody, Label, Row, Col, Button } from 'reactstrap';
import { Control, LocalForm } from 'react-redux-form';
import ClosableModal from '../modals/ClosableModalComponent';

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
            <ClosableModal title={'Review Book'} isModalOpen={this.props.isModalOpen} toggleModal={this.props.toggleModal}>
                <ModalBody>
                    <LocalForm onSubmit={this.handleSubmit} initialState={this.props.getInitialState}>
                        <Row className="form-group">
                            <Col>
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" name="rating" 
                                        className="form-control">
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
            </ClosableModal>
        );
    }
}

export default ReviewModal;