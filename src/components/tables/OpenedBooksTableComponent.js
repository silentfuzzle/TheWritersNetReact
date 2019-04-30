import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Progress } from 'reactstrap';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import { calculatePageSlice } from '../../utils/pagination';
import { findUserReview } from '../../utils/functions';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books,
        openedBooks: state.openedBooks,
        pages: state.pages,
        reviews: state.reviews,
        user: state.login.user
    };
}

class OpenedBooksTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            removeModalOpen: false,
            selectedBook: 0,
            books: {
                isLoading: false,
                errMess: '',
                books: []
            },
            orderby: '',
            orderasc: true,
            page: 1
        }

        this.headerData = [
            {
                id: 1,
                orderby: 'title',
                title: 'Title'
            },
            {
                id: 2,
                orderby: 'progress',
                title: 'Percentage Read'
            },
            {
                id: 3,
                orderby: 'rating',
                title: 'My Rating'
            }
        ];

        this.anchor = 'opened-books';

        this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    toggleRemoveModal(bookid = 0) {
        this.setState({
            removeModalOpen: !this.state.removeModalOpen,
            selectedBook: bookid
        })
    }

    removeHandler() {
        console.log(this.state.selectedBook);
        this.toggleRemoveModal();
    }

    fetchBooks() {
        // This method would fetch the books from a database in the required form
        // It may also handle filtering, sorting, and pagination if the database is very large
        this.setState({
            books: {
                isLoading: true,
                errMess: '',
                books: []
            }
        });
        
        setTimeout(() => {
            let books = this.props.openedBooks.filter(book => {
                return book.userid === this.props.user.id;
            })
            .map(book => {
                const title = this.props.books.find(b => {
                        return b.id === book.bookid;
                    });
    
                const allPages = this.props.pages.filter(page => page.bookid === book.bookid);
                const progress = book.visitedpages.length / allPages.length * 100;
    
                const review = findUserReview(this.props.reviews, 
                    this.props.user.id, book.bookid);
    
                let rating = "N/A";
                let reviewid = 0;
                if (review) {
                    rating = review.rating + "/5";
                    reviewid = review.id;
                }
                
                return {
                    id: book.bookid,
                    reviewid: reviewid,
                    title: title.title,
                    progress: progress,
                    rating: rating,
                    currpage: book.currpage
                };
            });
    
            this.setState({
                books: {
                    isLoading: false,
                    errMess: '',
                    books: books
                }
            });
        }, 2000);
    }

    getBooks() {
        let books = this.state.books.books;

        if (this.state.orderby !== '') {
            const orderby = this.state.orderby;

            books = books.sort((a, b) => {
                return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0)
            });

            if (!this.state.orderasc) {
                books = books.reverse();
            }
        }

        return books;
    }

    setSort(orderby) {
        if (orderby === this.state.orderby) {
            this.setState({
                orderasc: !this.state.orderasc
            });
        } else {
            this.setState({
                orderasc: true,
                orderby: orderby
            });
        }
    }

    setPage(page) {
        this.setState({
            page: page
        });
    }

    renderColumns() {
        return (
            <colgroup></colgroup>
        );
    }

    renderHead() {
        const sortableColumns = this.headerData.map(header => {
            return (
                <SortableColumn key={header.id} header={header} 
                    orderby={this.state.orderby} 
                    orderasc={this.state.orderasc} 
                    anchor={'#' + this.anchor} 
                    setSort={(orderby) => this.setSort(orderby)} />
            );
        });

        return (
            <React.Fragment>
                {sortableColumns}
                <th>Options</th>
            </React.Fragment>
        );
    }

    renderBody(books) {
        return (
            <React.Fragment>
                {books.map(book => {
                    return (
                        <tr key={book.id}>
                            <th scope="row"><Link to={`/book/${book.id}`}>{book.title}</Link></th>
                            <td><Progress value={book.progress} color="dark" /></td>
                            <td><a href={'#' + this.anchor} onClick={() => this.props.toggleReviewModal(book.reviewid)}>{book.rating}</a></td>
                            <td>
                                <Link to={`page/${book.currpage}`}><span className="fa fa-eye" title="Open"></span> </Link>
                                <a href={'#' + this.anchor} onClick={() => this.toggleRemoveModal(book.id)}><span className="fa fa-remove" title="Remove"></span></a>
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.fetchBooks();
    }

    render() {
        if (this.state.books.isLoading) {
            return (
                <h4>Loading Books...</h4>
            );
        } else if (this.state.books.errMess) {
            return (
                <h4>{this.state.books.errMess}</h4>
            );
        }

        let books = this.getBooks();
        const totalItems = books.length;
        books = books.slice(...calculatePageSlice(this.state.page));

        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.removeModalOpen} 
                    toggleModal={this.toggleRemoveModal} 
                    submitHandler={this.removeHandler}
                    buttonText={'Remove'}>
                    <p>Are you sure you want to remove this book from your library? You will lose your progress.</p>
                </ConfirmActionModal>
                <TableContainer columns={this.renderColumns} 
                    thead={this.renderHead} 
                    tbody={this.renderBody}
                    items={books}
                    anchor={'#' + this.anchor}
                    setPage={(page) => this.setPage(page)}
                    currPage={this.state.page}
                    totalItems={totalItems} />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(OpenedBooksTable);