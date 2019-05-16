import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import EditBookForm from '../forms/EditBookFormComponent';
import PermissionsTable from '../tables/PermissionsTableComponent';
import PagesTable from '../tables/PagesTableComponent';
import SectionsTable from '../tables/SectionsTableComponent';

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
                <div className="row">
                    <div className="col">
                        <EditBookForm 
                            toggleMarkdownModal={this.props.toggleMarkdownModal}
                            bookid={this.props.bookid}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <PermissionsTable bookid={this.props.bookid} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2>Pages</h2>
                    </div>
                    <div className="col">
                        <Link to={'/page/edit'}>Create New Page</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <PagesTable bookid={this.props.bookid} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2>Sections</h2>
                    </div>
                    <div className="col">
                        <Link to={'/section/edit'}>Create New Section</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <SectionsTable bookid={this.props.bookid} />
                    </div>
                </div>
            </div>
        );
    }
}

export default EditBook;