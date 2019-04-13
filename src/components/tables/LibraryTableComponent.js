import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import TableContainer from './TableContainerComponent';

class LibraryTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [
                {
                    id: 0,
                    title: 'Pajar',
                    subtitle: 'science fantasy',
                    author: 'Robert Gates',
                    length: 50,
                    ratingref: 3
                }
            ]
        };

        this.renderBody = this.renderBody.bind(this);
    }

    renderHead() {
        return (
            <React.Fragment>
                <th><a href="#">Title</a></th>
                <th><a href="#">Short Description</a></th>
                <th><a href="#">Author</a></th>
                <th><a href="#">Length</a></th>
                <th><a href="#">Rating</a></th>
            </React.Fragment>
        );
    }

    renderBody() {
        const books = this.state.books.map((book) => {
            return (
                <tr key={book.id}>
                    <th><Link to={`/book/${book.id}`}>{book.title}</Link></th>
                    <td>{book.subtitle}</td>
                    <td>{book.author}</td>
                    <td><Progress value={book.length} color="dark" /></td>
                    <td>{book.ratingref}/5</td>
                </tr>
            );
        });

        return (
            <React.Fragment>
                {books}
            </React.Fragment>
        );
    }

    render() {
        return (
            <TableContainer thead={this.renderHead} tbody={this.renderBody} />
        );
    }
}

export default LibraryTable;