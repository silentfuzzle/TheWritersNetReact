import React from 'react';
import { Link } from 'react-router-dom';
import ReviewModal from '../modals/ReviewModalComponent';
import MyBooksTable from '../tables/MyBooksTableComponent';
import OpenedBooksTable from '../tables/OpenedBooksTableComponent';

function MyLibrary(props) {
    return (
        <React.Fragment>
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
                <div className="row">
                    <div className="col-auto">
                        <h2>My Books</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <OpenedBooksTable toggleReviewModal={props.toggleReviewModal} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MyLibrary;