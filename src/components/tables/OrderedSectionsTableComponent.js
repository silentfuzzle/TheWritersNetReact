import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Label, Row, Col, Form, Button } from 'reactstrap';
import TableContainer from './TableContainerComponent';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import EditIcon from '../pieces/EditIconComponent';
import DeleteIcon from '../pieces/DeleteIconComponent';
import { calculatePageSlice } from '../../utils/pagination';
import { trimContent } from '../../utils/functions';
import ViewIcon from '../pieces/ViewIconComponent';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        sections: state.sections,
        pageSections: state.pageSections
    }
}

class OrderedSectionsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteModalOpen: false,
            selectedSection: 0,
            existingSection: 1,
            addingSection: false,
            isLoading: false,
            errMess: '',
            pageSections: [],
            bookSections: [],
            page: 1
        }

        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    fetchSections() {
        // This method would fetch the books from a database in the required form
        // It may also handle filtering, sorting, and pagination if the database is very large
        this.setState({
            isLoading: true,
            errMess: '',
            pageSections: [],
            bookSections: []
        });
        
        setTimeout(() => {
            const pageSections = this.props.pageSections.filter(ps => ps.pageid === this.props.pageid)
                .map(ps => {
                    const section = this.props.sections.find(s => s.id === ps.sectionid);
                    
                    return {
                        ...section,
                        position: ps.position,
                        content: trimContent(section.content)
                    }
                })
                .sort((a, b) => {
                    return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0)
                });

            const bookSections = this.props.sections.filter(s => s.bookid === this.props.bookid);
    
            this.setState({
                isLoading: false,
                errMess: '',
                pageSections: pageSections,
                bookSections: bookSections
            });
        }, 2000);
    }

    toggleDeleteModal(secid = 0) {
        this.setState({
            deleteModalOpen: !this.state.deleteModalOpen,
            selectedSection: secid
        });
    }

    deleteHandler() {
        console.log(this.state.selectedSection);
        this.toggleDeleteModal();
    }

    setPosition(id, newPosition) {
        console.log('set section ' + id + ' to position ' + newPosition);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        this.setState({
            addingSection: true
        });

        setTimeout(() => {
            console.log('Add ' + this.state.existingSection + ' to end of section list');
            this.setState({
                existingSection: 1,
                addingSection: false
            });
        }, 2000);

        event.preventDefault();
    }

    saveSections() {
        console.log('Save sections');
    }

    setPage(page) {
        this.setState({
            page: page
        });
    }

    renderColumns() {
        return (
            <colgroup>
                <col style={{width: '10%'}} />
                <col style={{width: '20%'}} />
                <col style={{width: '60%'}} />
                <col style={{width: '10%'}} />
            </colgroup>
        );
    }

    renderHead() {
        return (
            <React.Fragment>
                <th>Order</th>
                <th>Title</th>
                <th>Content</th>
                <th>Options</th>
            </React.Fragment>
        );
    }

    renderBody(sections) {
        return (
            <React.Fragment>
                {sections.map(s => {
                    let upButton = !(s.position > 1);
                    let downButton = !(s.position < this.state.pageSections.length);
                    
                    return (
                        <tr key={s.id}>
                            <td>
                                <div className="row justify-content-center">
                                    <div className="col-auto">
                                        <Button color="link" disabled={upButton} onClick={() => this.setPosition(s.id, s.position + 1)}>
                                            <span className="fa fa-sort-asc"></span>
                                        </Button>
                                    </div>
                                    <div className="w-100"></div>
                                    <div className="col-auto">{s.position}</div>
                                    <div className="w-100"></div>
                                    <div className="col-auto">
                                        <Button color="link" disabled={downButton} onClick={() => this.setPosition(s.id, s.position - 1)}>
                                            <span className="fa fa-sort-desc"></span>
                                        </Button>
                                    </div>
                                </div>
                            </td>
                            <td><Link to={`/section/${s.id}`}>{s.title}</Link></td>
                            <td>{s.content}</td>
                            <td>
                                <ViewIcon link={`/section/${s.id}/${this.props.pageid}`} title="View" />
                                <EditIcon link={`/section/${s.id}/edit/${this.props.pageid}`} />
                                <DeleteIcon onClick={() => this.toggleDeleteModal(s.id)} title="Remove" />
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.fetchSections();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Sections...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        let sections = this.state.pageSections;
        const totalItems = sections.length;
        sections = sections.slice(...calculatePageSlice(this.state.page));

        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.deleteModalOpen} 
                    toggleModal={this.toggleDeleteModal} 
                    submitHandler={this.deleteHandler}
                    buttonText={'Remove'}
                    >
                    <p>Are you sure you want to remove this section from this page?</p>
                </ConfirmActionModal>
                <TableContainer columns={this.renderColumns} 
                    thead={this.renderHead} 
                    tbody={this.renderBody}
                    items={sections}
                    setPage={(page) => this.setPage(page)}
                    currPage={this.state.page}
                    totalItems={totalItems}
                    />
                <Row className="justify-content-between">
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col xs={3} className="form-group">
                                    <Label className="sr-only" htmlFor="existingSection">Existing Section</Label>
                                    <select
                                        className="form-control"
                                        id="existingSection"
                                        name="existingSection"
                                        value={this.state.existingSection}
                                        onChange={this.handleChange}
                                        >
                                        {
                                            this.state.bookSections.map(s => {
                                                return (<option key={s.id} value={s.id}>{s.title}</option>);
                                            })
                                        }
                                    </select>
                                </Col>
                                <Col xs='auto'>
                                    <Button color="success" disabled={this.state.addingSection}>Add Existing Section</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col xs='auto'>
                        <Button color="success" onClick={this.saveSections}>Save</Button>
                    </Col>
                </Row>
                <Row className="justify-content-end pb-3">
                    <Col xs='auto'>
                        <Link to={`/page/${this.props.pageid}`} className="btn btn-success">View Page</Link>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(OrderedSectionsTable);