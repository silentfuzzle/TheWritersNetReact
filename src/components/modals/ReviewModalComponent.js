import React, { Component } from 'react';
import { Label, Row, Col, Button } from 'reactstrap';
import { Control, LocalForm } from 'react-redux-form';
import ClosableModal from '../modals/ClosableModalComponent';
import UnclosableModal from '../modals/UnclosableModalComponent';

class ReviewModal extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    renderForm() {
        return (
            <LocalForm onSubmit={this.handleSubmit} initialState={this.props.initialState}>
                <Row className="form-group">
                    <Col>
                        <Label htmlFor="rating">Rating</Label>
                        <Control.select 
                            model=".rating" 
                            name="rating" 
                            className="form-control" 
                            disabled={this.props.reviewLoading}
                            >
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
                            className="form-control"
                            disabled={this.props.reviewLoading} />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col>
                        <Label htmlFor="review">Review (Optional)</Label>
                        <Control.textarea model=".review" id="review" name="review" rows="6" 
                            className="form-control"
                            disabled={this.props.reviewLoading} />
                    </Col>
                </Row>
                <Row className="form-group justify-content-end">
                    <Col xs="auto">
                        <Button className="mr-1" onClick={() => this.props.toggleModal(0)} disabled={this.props.reviewLoading}>Cancel</Button>
                        <Button type="submit" color="success" disabled={this.props.reviewLoading}>Submit</Button>
                    </Col>
                </Row>
            </LocalForm>
        );
    }

    render() {
        const title = 'Review Book';
        if (this.props.reviewLoading) {
            return (
                <UnclosableModal title={title} isModalOpen={this.props.isModalOpen}>
                    {this.renderForm()}
                </UnclosableModal>
            );
        } else {
            return (
                <ClosableModal title={title} isModalOpen={this.props.isModalOpen} toggleModal={() => this.props.toggleModal(0)}>
                    {this.renderForm()}
                </ClosableModal>
            );
        }
    }
}

export default ReviewModal;