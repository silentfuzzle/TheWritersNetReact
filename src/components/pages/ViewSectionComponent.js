import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import MarkdownToHTML from '../pieces/MarkdownToHTMLComponent';

const mapStateToProps = state => {
    // With an actual database, users and reviews would not be necessary here
    return {
        sections: state.sections
    };
};

class ViewSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            section: {
                bookid: 0,
                displaytitle: false,
                title: '',
                content: ''
            }
        }
    }

    fetchSection() {
        this.setState({
            isLoading: true,
            errMess: '',
            section: {
                bookid: 0,
                displaytitle: false,
                title: '',
                content: ''
            }
        });

        setTimeout(() => {
            const section = this.props.sections.find(s => s.id === this.props.sectionid);

            this.setState({
                isLoading: false,
                section: section
            });
        }, 2000);
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

        let title = (<React.Fragment></React.Fragment>);
        if (this.state.section.displaytitle)
            title = (<h2>{this.state.section.title}</h2>);

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
                        <BreadcrumbItem><Link to={`/section/${this.state.section.id}/edit/${this.props.pageid}`}>Edit Section</Link></BreadcrumbItem>
                        <BreadcrumbItem active>View Section</BreadcrumbItem>
                    </Breadcrumb>
                </Row>
                <Row>
                    {title}
                    <MarkdownToHTML input={this.state.section.content} />
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ViewSection);