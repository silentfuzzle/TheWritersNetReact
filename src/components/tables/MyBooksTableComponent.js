import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';
import { calculatePageSlice } from '../../utils/pagination';

const mapStateToProps = state => {
    return {
        books: state.books,
        permissions: state.permissions,
        permissionTypes: state.permissionTypes,
        user: state.login.user
    }
}

class MyBooksTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                orderby: 'authorship',
                title: 'Authorship'
            }
        ];

        this.anchor = 'my-books';

        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    fetchBooks() {
        // This method would fetch the books from a database in the required form
        // It may also handle filtering, sorting, and pagination if the database is very large
        let books = this.props.books.filter(book => {
            const permission = this.props.permissions.find(permission => {
                permission.userid === this.props.user.id &&
                permission.bookid === book.id &&
                permission.permissionid < 3
            });

            return permission;
        })
        .map(book => {
            const permission = this.props.permissions.find(permission => {
                permission.userid === this.props.user.id &&
                permission.bookid === book.id
            });

            const type = this.props.permissionTypes.find(type => {
                type.id === permission.permissionid
            });

            return {
                id: book.id,
                title: book.title,
                authorship: type.name
            }
        });

        this.setState({
            books: {
                isLoading: false,
                errMess: '',
                books: books
            }
        });
    }

    getBooks() {
        let books = this.state.books.books;

        if (this.state.orderby !== '') {
            books = books.sort((a, b) => {
                (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0)
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
                            <td>{book.authorship}</td>
                            <td>Edit | View | Delete</td>
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
            <TableContainer columns={this.renderColumns} 
                thead={this.renderHead} 
                tbody={this.renderBody}
                items={books}
                anchor={'#' + this.anchor}
                setPage={(page) => this.setPage(page)}
                currPage={this.state.page}
                totalItems={totalItems} />
        );
    }
}

export default connect(mapStateToProps)(MyBooksTable);