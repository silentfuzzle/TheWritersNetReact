import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import ReviewModal from '../modals/ReviewModalComponent';

class MyLibrary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteModalOpen: false,
            removeModalOpen: false
        }
    }

    toggleDeleteModal() {
        this.setState({
            deleteModalOpen: !this.state.deleteModalOpen
        });
    }

    toggleRemoveModal() {
        this.setState({
            removeModalOpen: !this.state.removeModalOpen
        })
    }

    deleteHandler() {

    }

    removeHandler() {

    }

    render() {
        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.deleteModalOpen} 
                    toggleModal={this.toggleDeleteModal} 
                    submitHandler={this.deleteHandler}
                    buttonText={'Delete'}>
                    <p>Are you sure you want to delete this book and all its contents?</p>
                </ConfirmActionModal>
                <ConfirmActionModal isModalOpen={this.removeModalOpen} 
                    toggleModal={this.toggleRemoveModal} 
                    submitHandler={this.removeHandler}
                    buttonText={'Remove'}>
                    <p>Are you sure you want to remove this book from your library? You will lose your progress.</p>
                </ConfirmActionModal>
                <ReviewModal />
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>MyLibrary</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <h2>My Books</h2>
                        </div>
                        <div className="col">
                            <Link to={'/book/edit'}>Create New Book</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}