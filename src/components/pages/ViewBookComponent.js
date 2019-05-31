import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Progress, Button } from 'reactstrap';
import ReviewsList from '../pieces/ReviewsListComponent';
import { calculatePageSlice } from '../../utils/pagination';
import { getAuthors, getRating, findUserReview } from '../../utils/functions';
import MarkdownToHTML from '../pieces/MarkdownToHTMLComponent';

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
                    description: ''
                }
            },
            reviews: {
                reviews: [],
                page: 1
            }
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
            const reviews = this.props.reviews
                .filter(review => review.bookid === book.id)
                .map(review => {
                    const author = this.props.users.find(u => u.id === review.userid);

                    return {
                        ...review,
                        author: author.displayname
                    }
                });
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
                reviews: {
                    reviews: reviews,
                    page: 1
                }
            });
        }, 2000);
    }

    setPage(page) {
        this.setState({
            reviews: {
                ...this.state.reviews,
                page: page
            }
        });
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
        let isAuthor = false;
        const numAuthors = this.state.book.book.authors.length;
        const authors = this.state.book.book.authors.map(author => {
            let separator = '';
            if (numAuthors > 1) {
                if (i < numAuthors - 1 && numAuthors > 2)
                    separator += ',';
                if (i < numAuthors - 1)
                    separator += ' ';
                if (i === numAuthors - 2)
                    separator += 'and ';
                i++;
            }

            if (author.id === this.props.user.id)
                isAuthor = true;

            const val = (
                <React.Fragment key={author.id}>
                    <Link to={`/profile/${author.id}`}>{author.name}</Link>{separator}
                </React.Fragment>
            );

            return val;
        });

        let editBook = (<div></div>);
        if (isAuthor) {
            editBook = (
                <div className="row">
                    <div className="col">
                        <Link to={`/book/${this.props.bookid}/edit`}>Edit Book</Link>
                    </div>
                </div>
            );
        }

        const dtClass = "col-2";
        const book = this.state.book.book;
        
        let reviews = this.state.reviews.reviews.filter(r => r.review !== '');
        const numReviews = reviews.length;
        reviews = reviews.slice(...calculatePageSlice(this.state.reviews.page));

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
                    <dd className="col-10">{book.rating}/5 (<Button color="link">{numReviews} Reviews</Button>, {this.state.reviews.reviews.length} Ratings)</dd>
                </dl>
                <div className="row">
                    <div className="col">
                        <MarkdownToHTML input={book.description} />
                    </div>
                </div>
                {editBook}
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Button color="success" href={`/page/${book.startpageid}`}>Read Book</Button>
                    </div>
                </div>
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <h2>{numReviews} Reviews</h2>
                    </div>
                    <div className="col-auto">
                        <Button color="success" onClick={() => this.props.toggleReviewModal(book.reviewid)}>Write Review</Button>
                    </div>
                </div>
                <ReviewsList 
                    reviews={reviews}
                    setPage={(page) => this.setPage(page)}
                    currPage={this.state.reviews.page}
                    totalItems={numReviews}
                    />
            </div>
        );
    }
}

export default connect(mapStateToProps)(ViewBook);