import React, { Component } from 'react';
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import HelpModal from '../modals/HelpModalComponent';
import Map from './MapComponent';

class BookNavigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isConfirmModalOpen: false,
            isHelpModalOpen: false,
            isDropdownOpen: false,
            forceDirected: true
        }

        this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
        this.toggleHelpModal = this.toggleHelpModal.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.forceDirected = this.forceDirected.bind(this);
        this.rainbowGraph = this.rainbowGraph.bind(this);
    }

    toggleConfirmModal() {
        this.setState({
            isConfirmModalOpen: !this.state.isConfirmModalOpen
        });
    }

    toggleHelpModal() {
        this.setState({
            isHelpModalOpen: !this.state.isHelpModalOpen
        });
    }

    toggleDropdown() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        });
    }

    restart() {
        console.log('Restart');
    }

    forceDirected() {
        console.log('Force directed');
        this.setState({
            forceDirected: true
        });
    }

    rainbowGraph() {
        console.log('Rainbow graph');
        this.setState({
            forceDirected: false
        });
    }

    render() {
        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.isConfirmModalOpen} 
                    toggleModal={this.toggleConfirmModal} 
                    submitHandler={this.restart}
                    buttonText={'Restart'}>
                    <p>Are you sure you want to clear your progress and start over from the beginning?</p>
                </ConfirmActionModal>
                <HelpModal 
                    title={'Map Help'}
                    isModalOpen={this.state.isHelpModalOpen}
                    toggleModal={this.toggleHelpModal}
                    >
                    <p>Insert map instructions here.</p>
                </HelpModal>
                <Row>
                    <Col>
                        <h3 className="text-white">Book Navigation</h3>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs='auto'>
                        <p className="text-white">You've read {this.props.pagesRead} out of {this.props.totalPages}.</p>
                    </Col>
                    <Col xs='auto'>
                        <Button color='success' onClick={this.toggleConfirmModal}>Restart</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col>
                        <Map />
                    </Col>
                </Row>
                <Row className="justify-content-around">
                    <Col xs="auto">
                        <Dropdown direction="up" isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
                            <DropdownToggle color="success" caret>Map Layout</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem 
                                    onClick={this.forceDirected}
                                    active={this.state.forceDirected}
                                    >
                                    Force Directed
                                </DropdownItem>
                                <DropdownItem 
                                    onClick={this.rainbowGraph}
                                    active={!this.state.forceDirected}
                                    >
                                    Rainbow Graph
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Col xs="auto">
                        <Button color="link" onClick={this.toggleHelpModal}>Help</Button>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default BookNavigation;