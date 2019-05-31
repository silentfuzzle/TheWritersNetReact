import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import MarkdownToHTML from '../pieces/MarkdownToHTMLComponent';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        pages: state.pages,
        books: state.books,
        sections: state.sections,
        pageSections: state.pageSections,
        permissions: state.permissions,
        user: state.login.user
    }
}

class PageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            page: {},
            sections: []
        }
    }

    fetchPage() {
        this.setState({
            isLoading: true,
            errMess: ''
        });

        setTimeout(() => {
            const page = this.props.pages.find(p => p.id === this.props.pageid);
            const book = this.props.books.find(b => b.id === page.bookid);
            const sections = this.props.pageSections.filter(s => s.pageid === this.props.pageid)
                .map(ps => {
                    const section = this.props.sections.find(s => s.id === ps.sectionid);
                    return {
                        ...section,
                        position: ps.position
                    }
                })
                .sort((a, b) => {
                    return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);
                });

            const isAuthor = this.props.permissions.some(p => 
                p.userid === this.props.user.id && 
                p.bookid === page.bookid && 
                p.permissionid < 3);

            this.setState({
                isLoading: false,
                errMess: '',
                page: {
                    ...page,
                    booktitle: book.title,
                    isAuthor: isAuthor
                },
                sections: sections
            });
        }, 2000);
    }

    componentDidMount() {
        this.fetchPage();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Page...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }
        
        let editBook = (<div></div>);
        if (this.state.page.isAuthor) {
            editBook = (
                <Row>
                    <Col>
                        <Link to={`/book/${this.state.page.bookid}/edit`}>Edit Book</Link>
                    </Col>
                </Row>
            );
        }

        return (
            <div className="container">
                <Row>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/mylibrary'>My Library</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/book/${this.state.page.bookid}`}>{this.state.page.booktitle}</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.page.title}</BreadcrumbItem>
                    </Breadcrumb>
                </Row>
                <Row>
                    <Col xs="auto">
                        <h1>{this.state.page.title}</h1>
                    </Col>
                </Row>
                {editBook}
                <Row>
                    <Col>
                        {this.state.sections.map(s => (<MarkdownToHTML input={s.content} />))}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(PageContent);