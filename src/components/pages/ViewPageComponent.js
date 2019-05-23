import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import BookNavigationBar from '../pieces/BookNavigationBarComponent';
import BookNavigation from '../pieces/BookNavigationComponent';

class ViewPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSidebarOpen: false,
            isNavExpanded: false,
            useSidebar: true
        }

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleNavExpand = this.toggleNavExpand.bind(this);
    }

    toggleSidebar() {
        this.setState({
            isSidebarOpen: !this.state.isSidebarOpen
        });
    }

    toggleNavExpand() {
        this.setState({
            isNavExpanded: !this.state.isNavExpanded
        });
    }
    
    resize() {
        const useSidebar = window.innerWidth > 760;
        if (this.state.useSidebar !== useSidebar) {
            this.setState({
                useSidebar: useSidebar,
                isSidebarOpen: false,
                isNavExpanded: this.state.isSidebarOpen
            });
        }
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize");
    }

    render() {
        const bookNavigation = (
            <BookNavigation 
                pagesRead={12}
                totalPages={25} 
                />
        );

        let sidebar = (<div></div>);
        if (this.state.useSidebar) {
            sidebar = (
                <nav className="bg-dark" id="sidebar-pusher">
                    <div className="p-4" id="sidebar">
                        {bookNavigation}
                    </div>
                </nav>
            );
        }

        let navbar = (<div></div>);
        if (!this.state.useSidebar) {
            navbar = bookNavigation;
        }

        return (
            <React.Fragment>
                <BookNavigationBar
                    isMapOpen={this.state.isNavExpanded}
                    toggleSidebar={this.toggleSidebar}
                    toggleNavExpand={this.toggleNavExpand}
                    pageid={this.props.pageid}
                    pagetitle='test'
                    >
                    {navbar}
                </BookNavigationBar>
                <div className="wrapper">
                    {sidebar}
                    <div className="container">
                        <Row>
                            <Breadcrumb>
                                <BreadcrumbItem><Link to='/mylibrary'>My Library</Link></BreadcrumbItem>
                                <BreadcrumbItem><Link to={`/book/${this.state.bookid}`}>View Book</Link></BreadcrumbItem>
                                <BreadcrumbItem active>Edit Page</BreadcrumbItem>
                            </Breadcrumb>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewPage;