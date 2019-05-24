import React, { Component } from 'react';
import BookNavigationBar from '../pieces/BookNavigationBarComponent';
import BookNavigation from '../pieces/BookNavigationComponent';
import PageContent from '../pieces/PageContentComponent';

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
        this.resize = this.resize.bind(this);
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
        window.addEventListener("resize", this.resize);
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    render() {
        const bookNavigation = (
            <BookNavigation 
                pagesRead={12}
                totalPages={25} 
                />
        );

        let sidebar = (<div></div>);
        if (this.state.useSidebar && this.state.isSidebarOpen) {
            sidebar = (
                <nav className="bg-dark" id="sidebar-pusher">
                    <div className="bg-dark p-4" id="sidebar">
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
                    <PageContent pageid={this.props.pageid} />
                </div>
            </React.Fragment>
        );
    }
}

export default ViewPage;