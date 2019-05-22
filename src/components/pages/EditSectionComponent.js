import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, BreadcrumbItem, Label, Button } from 'reactstrap';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { connect } from 'react-redux';
import GenerateLinkForm from '../forms/GenerateLinkFormComponent';
import { required } from '../../utils/validators';

const mapStateToProps = state => {
    // With an actual database, users and reviews would not be necessary here
    return {
        pages: state.pages,
        sections: state.sections
    };
};

class EditSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            section: {
                bookid: 0
            },
            pages: []
        }
    }

    fetchSection() {
        this.setState({
            isLoading: true,
            errMess: '',
            section: {
                bookid: 0
            }
        });

        setTimeout(() => {
            const section = this.props.sections.find(s => s.id === this.props.sectionid);
            const pages = this.props.pages.filter(p => p.bookid === section.bookid);

            this.setState({
                isLoading: false,
                section: section,
                pages: pages
            });
        }, 2000);
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values));
    }

    componentDidMount() {
        this.fetchSection();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Section...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        let pageBreadcrumb = (<React.Fragment></React.Fragment>);
        if (this.props.pageid !== 0)
            pageBreadcrumb = (<BreadcrumbItem><Link to={`/page/${this.props.pageid}/edit`}>Edit Page</Link></BreadcrumbItem>);

        return (
            <div className="container">
                <Row>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/mylibrary'>My Library</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/book/${this.state.section.bookid}/edit`}>Edit Book</Link></BreadcrumbItem>
                        {pageBreadcrumb}
                        <BreadcrumbItem active>Edit Section</BreadcrumbItem>
                    </Breadcrumb>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h1>Edit Section</h1>
                    </Col>
                    <Col>
                        <Link to={'/section/edit'}>Create New Section</Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <LocalForm onSubmit={this.handleSubmit} initialState={this.state.section}>
                            <Row className="form-group">
                                <Col>
                                    <Label for="title">Title</Label>
                                    <Control.text 
                                        model=".title" 
                                        className="form-control" 
                                        id="title"
                                        name="title"
                                        validators={{ required }}
                                        />
                                    <Errors 
                                        className="text-danger"
                                        model=".title" 
                                        show="touched" 
                                        messages={{ required: 'Required' }}
                                        />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <div className="form-check">
                                        <Control.checkbox 
                                            model=".displaytitle" 
                                            name="displaytitle"
                                            className="form-check-input"
                                            />
                                        <Label check>Display Title?</Label>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label for="content">Content</Label>
                                    <Control.textarea
                                        model=".content"
                                        className="form-control mr-1"
                                        id="content"
                                        name="content"
                                        rows="10"
                                        />
                                    <Button color="link" onClick={this.props.toggleMarkdownModal}>Markdown Help</Button>
                                </Col>
                            </Row>
                            <Row className="form-group justify-content-end">
                                <Col xs="auto">
                                    <Link className="btn btn-success mr-2" to={`/section/${this.props.sectionid}/${this.props.pageid}`}>View Section</Link>
                                    <Button color="success">Save</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </Col>
                    <Col className="align-self-center">
                        <GenerateLinkForm bookid={this.state.section.bookid} pages={this.state.pages} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EditSection);