import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import LoginOrSignup from './pieces/LoginOrSignupComponent';
import UserNavigator from './pieces/UserNavigatorComponent';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNavOpen: false
        };

        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    render() {
        let userOptions = <LoginOrSignup toggleSignupModal={this.props.toggleSignupModal} />
        if (this.props.isLoggedIn) {
            userOptions = <UserNavigator />
        }

        return (
            <React.Fragment>
                <Navbar dark expand="sm" color="dark" className="fixed-top">
                    <div className="container">
                        <NavbarBrand href="/">The Writer's Net</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNav} />
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to="/library">Library</NavLink>
                                </NavItem>
                            </Nav>
                            <div className="ml-auto">
                                {userOptions}
                            </div>
                        </Collapse>
                    </div>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default Header;