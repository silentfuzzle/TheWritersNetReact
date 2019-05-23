import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import { Row, Col, Navbar, NavbarToggler, Collapse, Button } from 'reactstrap';
import SplitDropupButton from './SplitDropupButtonComponent';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        books: state.books,
        openedBooks: state.openedBooks,
        pages: state.pages,
        user: state.login.user
    }
}

class BookNavigationBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            book: {
                startingpageid: 0,
                title: ''
            },
            prevHistory: [],
            nextHistory: []
        }
    }

    fetchHistory() {
        this.setState({
            isLoading: true,
            errMess: '',
            book: {
                startingpageid: 0,
                title: ''
            },
            prevHistory: [],
            nextHistory: []
        });

        setTimeout(() => {
            const page = this.props.pages.find(p => p.id === this.props.pageid);
            const book = this.props.books.find(book => book.id === page.bookid);
            const openedBook = this.props.openedBooks.find(b => b.bookid === page.bookid && b.userid === this.props.user.id);
            
            const pageMapper = h => {
                const page = this.props.pages.find(p => p.id === h);
                return {
                    id: page.id,
                    title: page.title
                }
            };

            const prevHistory = openedBook.prevhistory.map(pageMapper);
            const nextHistory = openedBook.nexthistory.map(pageMapper);

            this.setState({
                isLoading: false,
                errMess: '',
                book: book,
                prevHistory: prevHistory,
                nextHistory: nextHistory
            });
        }, 2000);
    }

    navigatePrevious(item) {
        let prevHistory = [...this.state.prevHistory];
        let nextHistory = [...this.state.nextHistory];

        nextHistory.push({
            id: this.props.pageid,
            title: this.props.pagetitle
        });

        let done = false;
        do {
            const currItem = prevHistory.pop();
            if (currItem.id === item.id) {
                //TODO: Update database
                this.props.history.push(`/page/${currItem.id}`);
                done = true;
            } else {
                nextHistory.push(currItem);
            }
        }
        while (!done)
    }

    navigateNext(item) {
        let prevHistory = [...this.state.prevHistory];
        let nextHistory = [...this.state.nextHistory];

        prevHistory.push({
            id: this.props.pageid,
            title: this.props.pagetitle
        });

        let done = false;
        do {
            const currItem = nextHistory.pop();
            if (currItem.id === item.id) {
                //TODO: Update database
                this.props.history.push(`/page/${currItem.id}`);
                done = true;
            } else {
                prevHistory.push(currItem);
            }
        }
        while (!done)
    }

    componentDidMount() {
        this.fetchHistory();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading History...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        return (
            <div className="fixed-bottom">
                <Collapse isOpen={this.props.isMapOpen}>
                    <div className="bg-dark">
                        <div className="container p-2">
                            {this.props.children}
                        </div>
                    </div>
                </Collapse>
                <Navbar dark expand="sm" color="dark">
                    <div className="container">
                        <Col>
                            <Link className="navbar-brand" to={`/page/${this.state.book.startpageid}`}>{this.state.book.title}</Link>
                            <NavbarToggler 
                                onClick={this.props.toggleNavExpand}
                                className="d-inline d-md-none"
                                />
                            <Button 
                                color="success" 
                                onClick={this.props.toggleSidebar}
                                className="d-none d-md-inline"
                                >
                                Toggle Map
                            </Button>
                        </Col>
                        <Col>
                            <Row className="justify-content-center">
                                <SplitDropupButton
                                    text="Previous"
                                    history={this.state.prevHistory}
                                    navigate={(item) => this.navigatePrevious(item)}
                                    />
                                <p className="text-white pl-2 pr-2 d-none d-md-block col-form-label">Page History</p>
                                <SplitDropupButton
                                    text="Next"
                                    history={this.state.nextHistory}
                                    navigate={(item) => this.navigateNext(item)}
                                    />
                            </Row>
                        </Col>
                    </div>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(BookNavigationBar));