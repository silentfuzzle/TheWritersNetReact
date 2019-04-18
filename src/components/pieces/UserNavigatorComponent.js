import React, { Component } from 'react';
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
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret color="success">
                    Hello, {this.props.displayName}!
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>My Library</DropdownItem>
                    <DropdownItem>View Profile</DropdownItem>
                    <DropdownItem>Edit Profile</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.props.postLogout}>Logout</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

export default UserNavigator;