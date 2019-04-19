import React, { Component } from 'react';
import { Progress, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';
import { calculatePageSlice } from '../../utils/pagination';

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

        this.headerData = [
            {
                id: 1,
                orderby: 'title',
                title: 'Title'
            },
            {
                id: 2,
                orderby: 'subtitle',
                title: 'Short Description'
            },
            {
                id: 3,
                orderby: 'authors',
                title: 'Author'
            },
            {
                id: 4,
                orderby: 'length',
                title: 'Length'
            },
            {
                id: 5,
                orderby: 'rating',
                title: 'Rating'
            }
        ];

        this.anchor = 'library';

        this.filterToggle = this.filterToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
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
                const authors = this.props.permissions
                    .filter(p => 
                        p.bookid === book.id && p.permissionid < 3)
                    .sort((a1, a2) => 
                        (a1.permissionid > a2.permissionid) ? 1 : ((a2.permissionid > a1.permissionid) ? -1 : 0))
                    .map(permission => {
                        let author = this.props.users.find(user => user.id === permission.userid);
                        return {
                            id: author.id,
                            name: author.displayname
                        };
                    });
        
                const reviews = this.props.reviews.filter(review => review.bookid === book.id);
                let rating = reviews.reduce((total, review) => total += review.rating, 0);
                rating = Math.round(rating / reviews.length * 100) / 100;
        
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

        if (this.state.orderby !== '') {
            const orderby = this.state.orderby;

            books = books.sort((a, b) => {
                if (orderby === 'authors') {
                    return (a.authors[0].name > b.authors[0].name) ? 1 : ((b.authors[0].name > a.authors[0].name) ? -1 : 0);
                } else {
                    return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0);
                }
            });

            if (!this.state.orderasc) {
                books = books.reverse();
            }
        }

        return books;
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

    renderColumns() {
        return (
            <colgroup>
                <col style={{width: '20%'}} />
                <col style={{width: '40%'}} />
                <col style={{width: '20%'}} />
                <col style={{width: '10%'}} />
                <col style={{width: '10%'}} />
            </colgroup>
        );
    }

    renderHead() {
        return this.headerData.map(header => {
            return (
                <SortableColumn key={header.id} header={header} 
                    orderby={this.state.orderby} 
                    orderasc={this.state.orderasc} 
                    anchor={'#' + this.anchor} 
                    setSort={(orderby) => this.setSort(orderby)} />
            );
        });
    }

    renderBody(books) {
        return (
            <React.Fragment>
                {books.map(book => {
                        const authors = book.authors.map(author => {
                            return (
                                <li key={author.id}><Link to={`/profile/${author.id}`}>{author.name}</Link></li>
                            );
                        });

                        return (
                            <tr key={book.id}>
                                <th scope="row"><Link to={`/book/${book.id}`}>{book.title}</Link></th>
                                <td>{book.subtitle}</td>
                                <td>
                                    <ul className="list-unstyled">{authors}</ul>
                                </td>
                                <td><Progress value={book.length} color="dark" /></td>
                                <td>{book.rating}/5</td>
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

export default connect(mapStateToProps)(LibraryTable);