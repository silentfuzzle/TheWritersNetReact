import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import ReviewModal from '../modals/ReviewModalComponent';
import MyBooksTable from '../tables/MyBooksTableComponent';

class MyLibrary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            removeModalOpen: false
        }

        this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
    }

    toggleRemoveModal() {
        this.setState({
            removeModalOpen: !this.state.removeModalOpen
        })
    }

    removeHandler() {

    }

    render() {
        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.removeModalOpen} 
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
                            <MyBooksTable />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MyLibrary;