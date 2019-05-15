import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';

class BooksTable extends Component {
    constructor(props) {
        super(props);

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
        
        this.renderHead = this.renderHead.bind(this);
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
                    orderby={this.props.orderby} 
                    orderasc={this.props.orderasc}
                    setSort={(orderby) => this.props.setSort(orderby)} />
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

    render() {
        return (
            <TableContainer 
                columns={this.renderColumns} 
                thead={this.renderHead} 
                tbody={this.renderBody}
                items={this.props.books}
                setPage={(page) => this.props.setPage(page)}
                currPage={this.props.page}
                totalItems={this.props.totalItems} 
                />
        );
    }
}

export default BooksTable;