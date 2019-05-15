import React from 'react';
import { Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationControls from '../pieces/PaginationControlsComponent';
import { formatTimeStamp } from '../../utils/functions';

function ReviewsList(props) {
    const labelClass = 'col-5 col-md-3 col-lg-2';

    const reviews = props.reviews.map(review => {
        let bookname = (<div></div>);
        if (review.bookname) {
            bookname = (
                <div className="lead"><strong><Link to={`/book/${review.bookid}`}>{review.bookname}</Link></strong></div>
            );
        }

        return (
            <React.Fragment key={review.id}>
                <div className="row">
                    <div className="col">
                        {bookname}
                        <div className="lead">{review.title}</div>
                    </div>
                </div>
                <dl className="row">
                    <dt className={labelClass}>Rating:</dt>
                    <dd className="col">{review.rating}</dd>
                    <div className="w-100"></div>
                    <dt className={labelClass}>Percentage Read:</dt>
                    <dd className="col-3">
                        <Progress value={review.progress} color="dark" />
                    </dd>
                    <div className="w-100"></div>
                    <dt className={labelClass}>Date Reviewed:</dt>
                    <dd className="col">{formatTimeStamp(review.timestamp)}</dd>
                </dl>
                <div className="row">
                    <div className="col">
                        <p>{review.review}</p>
                        <p>--<Link to={`/profile/${review.userid}`}>{review.author}</Link></p>
                    </div>
                </div>
            </React.Fragment>
        );
    });

    return (
        <React.Fragment>
            {reviews}
            <PaginationControls
                setPage={props.setPage}
                currPage={props.currPage}
                numItems={props.totalItems} />
        </React.Fragment>
    );
}

export default ReviewsList;