import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import EditBookForm from '../forms/EditBookFormComponent';

class EditBook extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/mylibrary'>My Library</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Edit Book</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="row">
                    <div className="col">
                        <h1>Edit Book</h1>
                    </div>
                </div>
                <EditBookForm 
                    toggleMarkdownModal={this.props.toggleMarkdownModal}
                    bookid={this.props.bookid}
                    />
            </div>
        );
    }
}

export default EditBook;