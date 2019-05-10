import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { connect } from 'react-redux';
import BooksTable from './BooksTableComponent';
import { calculatePageSlice } from '../../utils/pagination';
import { getAuthors, getRating, orderBooks } from '../../utils/functions';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books,
        permissions: state.permissions,
        users: state.users,
        reviews: state.reviews
    };
};

class LibraryTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: {
                isLoading: false,
                errMess: '',
                books: []
            },
            filterResults: false,
            keywords: '',
            orderby: '',
            orderasc: true,
            page: 1
        }

        this.anchor = 'library';

        this.filterToggle = this.filterToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
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
            let books = this.props.books.map(book => {
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

        if (this.state.filterResults && this.state.keywords.trim().length > 0) {
            const keywords = this.state.keywords.toLowerCase();

            books = books.filter(book => {
                let authorIncludes = book.authors.find(author => author.name.toLowerCase().includes(keywords));

                return (book.title.toLowerCase().includes(keywords) || 
                    book.subtitle.toLowerCase().includes(keywords) || 
                    authorIncludes);
            });
        }

        return orderBooks(books, this.state.orderby, this.state.orderasc);
    }

    filterToggle() {
        this.setState({
            filterResults: !this.state.filterResults,
            page: 1
        });
    }

    handleChange(event) {
        if (this.state.filterResults) {
            this.setState({
                keywords: event.target.value,
                page: 1
            });
        } else {
            this.setState({
                keywords: event.target.value
            });
        }
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
                <div id={this.anchor} className="row justify-content-end">
                    <div className="col-sm-12 col-md-8 col-lg-6">
                        <InputGroup className="mb-3">
                            <Input type="text" placeholder="Keywords" 
                                aria-label="Keyword search" 
                                aria-describedby="search-filter"
                                value={this.state.keywords}
                                onChange={this.handleChange} />
                            <InputGroupAddon addonType="append">
                                <Button color="success" onClick={this.filterToggle} active={this.state.filterResults}>Filter Results</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
                <BooksTable
                    orderby={this.state.orderby}
                    orderasc={this.state.orderasc}
                    anchor={this.anchor}
                    setSort={(orderby) => this.setSort(orderby)}
                    books={books}
                    setPage={(page) => this.setPage(page)}
                    page={this.state.page}
                    totalItems={totalItems}
                    />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(LibraryTable);