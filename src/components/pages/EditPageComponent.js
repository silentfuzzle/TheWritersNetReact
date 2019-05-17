import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import EditPageForm from '../forms/EditPageFormComponent';
import OrderedSectionsTableComponent from '../tables/OrderedSectionsTableComponent';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        pages: state.pages
    }
}

class EditPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookid: 0
        };
    }

    componentDidMount() {
        const page = this.props.pages.find(p => p.id === this.props.pageid);

        this.setState({
            bookid: page.bookid
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/mylibrary'>My Library</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/book/${this.state.bookid}/edit`}>Edit Book</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Edit Page</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h1>Edit Page</h1>
                    </div>
                    <div className="col">
                        <Link to={'/page/edit'}>Create New Page</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <EditPageForm pageid={this.props.pageid} />
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
                        <OrderedSectionsTableComponent pageid={this.props.pageid} bookid={this.state.bookid} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EditPage);