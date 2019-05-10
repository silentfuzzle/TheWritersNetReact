import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BooksTable from '../tables/BooksTableComponent';
import ReviewsList from '../pieces/ReviewsListComponent';
import { calculatePageSlice } from '../../utils/pagination';
import { orderBooks, getAuthors, getRating } from '../../utils/functions';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books,
        reviews: state.reviews,
        permissions: state.permissions,
        users: state.users,
        user: state.login.user
    }
}

function SocialMediaBar({ user }) {
    let facebook = (<div></div>);
    if (user.facebook) {
        facebook = (<a className="btn btn-social-icon btn-facebook btn-lg" href={`http://www.facebook.com/${user.facebook}`}><i className="fa fa-facebook"></i></a>);
    }

    let linkedin = (<div></div>);
    if (user.linkedin) {
        linkedin = (<a className="btn btn-social-icon btn-linkedin btn-lg" href={`http://www.linkedin.com/in/${user.linkedin}`}><i className="fa fa-linkedin"></i></a>);
    }

    let twitter = (<div></div>);
    if (user.twitter) {
        twitter = (<a className="btn btn-social-icon btn-twitter btn-lg" href={`http://twitter.com/${user.twitter}`}><i className="fa fa-twitter"></i></a>);
    }

    let youtube = (<div></div>);
    if (user.youtube) {
        youtube = (<a className="btn btn-social-icon btn-google btn-lg" href={`http://youtube.com/c/${user.youtube}`}><i className="fa fa-youtube"></i></a>);
    }

    let website = (<div></div>);
    if (user.website) {
        website = (<a className="btn btn-social-icon btn-lg" href={`http://mywebsite.com/${user.website}`}><i className="fa fa-globe"></i></a>);
    }         

    return (
        <div className="row">
            <div className="col align-self-center">
                <div className="text-center">
                    {facebook}
                    {linkedin}
                    {twitter}
                    {youtube}
                    {website}
                </div>
            </div>
        </div>
    );
}

class ViewProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                isLoading: false,
                errMess: '',
                user: {
                    id: 0,
                    displayname: '',
                    about: ''
                 }
            },
            books: { 
                books: [],
                orderby: '',
                orderasc: true,
                page: 1
            },
            reviews: {
                reviews: [],
                page: 1
            }
        }

        this.booksAnchor = 'books';
        this.reviewsAnchor = 'reviews';

        this.setSort = this.setSort.bind(this);
        this.setBooksPage = this.setBooksPage.bind(this);
        this.setReviewsPage = this.setReviewsPage.bind(this);
    }

    fetchProfile() {
        this.setState({
            user: {
                isLoading: true,
                errMess: '',
                user: { }
            }
        });

        setTimeout(() => {
            const user = this.props.users.find(u => u.id === this.props.userid);

            let books = this.props.books
                .filter(book => {
                    const authors = getAuthors(this.props.permissions, this.props.users, book);
                    return authors.some(a => a.id === user.id);
                })
                .map(book => {
                    const authors = getAuthors(this.props.permissions, this.props.users, book);
            
                    const reviews = this.props.reviews.filter(review => review.bookid === book.id);
                    let rating = getRating(reviews);
            
                    return {
                        id: book.id,
                        title: book.title,
                        subtitle: book.subtitle,
                        authors: authors,
                        length: book.length,
                        rating: rating
                    }
                });
            
            const reviews = this.props.reviews
                .filter(review => review.userid === user.id && review.review !== '')
                .map(review => {
                    const book = this.props.books.find(b => b.id === review.bookid);

                    return {
                        ...review,
                        bookname: book.title,
                        author: user.displayname
                    }
                });

            this.setState({
                user: {
                    isLoading: false,
                    errMess: '',
                    user: user
                },
                books: { 
                    books: books,
                    orderby: '',
                    orderasc: true,
                    page: 1
                },
                reviews: {
                    reviews: reviews,
                    page: 1
                }
            });
        }, 2000);
    }

    getBooks() {
        return orderBooks(this.state.books.books, this.state.books.orderby, this.state.books.orderasc);
    }

    setSort(orderby) {
        if (orderby === this.state.books.orderby) {
            this.setState({
                books: {
                    ...this.state.books,
                    orderasc: !this.state.books.orderasc
                }
            });
        } else {
            this.setState({
                books: {
                    ...this.state.books,
                    orderasc: true,
                    orderby: orderby
                }
            });
        }
    }

    setBooksPage(page) {
        this.setState({
            books: {
                ...this.state.books,
                page: page
            }
        });
    }

    setReviewsPage(page) {
        this.setState({
            reviews: {
                ...this.state.reviews,
                page: page
            }
        });
    }

    componentDidMount() {
        this.fetchProfile();
    }

    render() {
        if (this.state.user.isLoading) {
            return (
                <h4>Loading Profile...</h4>
            );
        } else if (this.state.user.errMess) {
            return (
                <h4>{this.state.user.errMess}</h4>
            );
        }

        const user = this.state.user.user;

        let editProfile = (<div></div>);
        if (this.props.userid === this.props.user.id) {
            editProfile = (
                <div className="row">
                    <div className="col">
                        <Link to={`/profile/${user.id}/edit`}>Edit Profile</Link>
                    </div>
                </div>
            );
        }
        
        let books = this.getBooks();
        const totalItems = books.length;
        books = books.slice(...calculatePageSlice(this.state.books.page));

        let reviews = this.state.reviews.reviews;
        const numReviews = reviews.length;
        reviews = reviews.slice(...calculatePageSlice(this.state.reviews.page));

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>{user.displayname}</h1>
                    </div>
                </div>
                {editProfile}
                <div className="row">
                    <div className="col">
                        <h2>About</h2>
                        <p>{user.about}</p>
                    </div>
                </div>
                <SocialMediaBar user={user} />
                <div className="row">
                    <div className="col">
                        <h2 id={this.booksAnchor}>Books</h2>
                    </div>
                </div>
                <BooksTable
                    orderby={this.state.books.orderby}
                    orderasc={this.state.books.orderasc}
                    anchor={this.booksAnchor}
                    setSort={(orderby) => this.setSort(orderby)}
                    books={books}
                    setPage={(page) => this.setBooksPage(page)}
                    page={this.state.books.page}
                    totalItems={totalItems}
                    />
                <div className="row">
                    <div className="col">
                        <h2 id={this.reviewsAnchor}>Reviews</h2>
                    </div>
                </div>
                <ReviewsList 
                    reviews={reviews}
                    anchor={'#' + this.reviewsAnchor}
                    setPage={(page) => this.setReviewsPage(page)}
                    currPage={this.state.reviews.page}
                    totalItems={numReviews}
                    />
            </div>
        );
    }
}

export default connect(mapStateToProps)(ViewProfile);