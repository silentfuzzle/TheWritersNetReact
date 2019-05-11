import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class UserNavigator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        const activeStyle = { color: '#000' };

        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret color="success">
                    Hello, {this.props.displayName}!
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem><NavLink to="/mylibrary" activeStyle={activeStyle}>My Library</NavLink></DropdownItem>
                    <DropdownItem><NavLink to={`/profile/${this.props.userid}`} activeStyle={activeStyle}>View Profile</NavLink></DropdownItem>
                    <DropdownItem><NavLink to='/profile/edit' activeStyle={activeStyle}>Edit Profile</NavLink></DropdownItem>
                    <DropdownItem><NavLink to='/settings' activeStyle={activeStyle}>Settings</NavLink></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><a id="#logout" href="#logout" onClick={this.props.postLogout}>Logout</a></DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

export default UserNavigator;