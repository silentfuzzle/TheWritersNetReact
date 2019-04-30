import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Progress, Button } from 'reactstrap';
import { getAuthors, getRating, findUserReview } from '../../utils/functions';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books,
        openedBooks: state.openedBooks,
        reviews: state.reviews,
        permissions: state.permissions,
        users: state.users,
        user: state.login.user
    }
}

class ViewBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            book: {
                loadingBook: false,
                errMess: '',
                book: {
                    id: 0,
                    title: '',
                    subtitle: '',
                    authors: [],
                    length: 0,
                    description: ''}
            },
            reviews: []
        };
    }

    fetchBook() {
        this.setState({
            book: {
                loadingBook: true,
                errMess: '',
                book: {}
            }
        });

        setTimeout(() => {
            const book = this.props.books.find(book => book.id === this.props.bookid);
            const authors = getAuthors(this.props.permissions, this.props.users, book);
            const reviews = this.props.reviews.filter(review => review.bookid === book.id);
            const rating = getRating(reviews);

            let reviewid = 0;
            let startpageid = book.startpageid;
            if (this.props.user) {
                const openedBook = this.props.openedBooks.find(b => b.bookid === this.props.bookid && b.userid === this.props.user.id);
                if (openedBook) {
                    startpageid = openedBook.currpage;
                }

                const review = findUserReview(reviews, 
                    this.props.user.id, book.id);
                if (review) {
                    reviewid = review.id;
                }
            }

            this.setState({
                book: {
                    loadingBook: false,
                    errMess: '',
                    book: {
                        id: book.id,
                        startpageid: startpageid,
                        reviewid: reviewid,
                        title: book.title,
                        subtitle: book.subtitle,
                        authors: authors,
                        length: book.length,
                        rating: rating,
                        description: book.description
                    }
                },
                reviews: reviews
            });
        }, 2000);
    }

    componentDidMount() {
        this.fetchBook();
    }

    render() {
        if (this.state.book.loadingBook) {
            return (
                <h4>Loading Book...</h4>
            );
        } else if (this.state.book.errMess) {
            return (
                <h4>{this.state.book.errMess}</h4>
            );
        }

        let i = 0;
        const numAuthors = this.state.book.book.authors.length;
        const authors = this.state.book.book.authors.map(author => {
            let separator = '';
            if (numAuthors > 1) {
                if (i < numAuthors - 1)
                    separator = ', ';
                if (i === numAuthors - 2)
                    separator += 'and ';
                i++;
            }

            const val = (
                <React.Fragment key={author.id}>
                    <Link to={`/profile/${author.id}`}>{author.name}</Link>{separator}
                </React.Fragment>
            );

            return val;
        });

        const dtClass = "col-2";
        const book = this.state.book.book;
        const numReviews = this.state.reviews.filter(r => r.review !== '').length;

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>{book.title}</h1>
                        <h2>by {authors}</h2>
                        <p className="lead">{book.subtitle}</p>
                    </div>
                </div>
                <dl className="row">
                    <dt className={dtClass}>Length:</dt>
                    <dd className="col-3"><Progress value={book.length} color="dark" /></dd>
                    <div className="w-100"></div>
                    <dt className={dtClass}>Rating:</dt>
                    <dd className="col-10">{book.rating}/5 (<a href="#reviews">{numReviews} Reviews</a>, {this.state.reviews.length} Ratings)</dd>
                </dl>
                <div className="row">
                    <div className="col">
                        {book.description}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Button color="success" href={`/page/${book.startpageid}`}>Read Book</Button>
                    </div>
                </div>
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <h2 id="reviews">{numReviews} Reviews</h2>
                    </div>
                    <div className="col-auto">
                        <Button color="success" onClick={() => this.props.toggleReviewModal(book.reviewid)}>Write Review</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ViewBook);