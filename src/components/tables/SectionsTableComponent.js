import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import { calculatePageSlice } from '../../utils/pagination';
import EditIcon from '../pieces/EditIconComponent';
import DeleteIcon from '../pieces/DeleteIconComponent';

const mapStateToProps = state => {
    // With an actual database, this method would not be necessary
    return {
        pages: state.pages,
        sections: state.sections,
        pageSections: state.pageSections
    }
}

class SectionsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteModalOpen: false,
            selectedSection: 0,
            isLoading: false,
            errMess: '',
            sections: [],
            orderby: '',
            orderasc: true,
            page: 1
        }

        this.headerData = [
            {
                id: 1,
                orderby: 'title',
                title: 'Title'
            },
            {
                id: 2,
                orderby: 'content',
                title: 'Content'
            },
            {
                id: 3,
                orderby: 'inUse',
                title: 'In Use'
            }
        ];

        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.setSort = this.setSort.bind(this);
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
            sections: []
        });
        
        setTimeout(() => {
            const pages = this.props.pages.filter(p => p.bookid === this.props.bookid);

            const sections = this.props.sections.filter(s => s.bookid === this.props.bookid)
                .map(s => {
                    const inUse = this.props.pageSections.some(ps => {
                        if (ps.sectionid === s.id) {
                            return pages.some(p => p.id === ps.pageid && p.bookid === this.props.bookid);
                        }
                        return false;
                    });

                    return {
                        ...s,
                        inUse: inUse,
                        content: (s.content.length > 100 ? s.content.substring(0, 100) + '...' : s.content)
                    }
                });
    
            this.setState({
                isLoading: false,
                errMess: '',
                sections: sections
            });
        }, 2000);
    }

    getSections() {
        let sections = this.state.sections;

        if (this.state.orderby !== '') {
            const orderby = this.state.orderby;

            sections = sections.sort((a, b) => {
                return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0)
            });

            if (!this.state.orderasc) {
                sections = sections.reverse();
            }
        }

        return sections;
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

    setSort(orderby) {
        if (orderby === this.state.orderby) {
            this.setState({
                orderasc: !this.state.orderasc
            });
        } else {
            this.setState({
                orderasc: true,
                orderby: orderby
            });
        }
    }

    setPage(page) {
        this.setState({
            page: page
        });
    }

    renderColumns() {
        return (
            <colgroup>
                <col style={{width: '20%'}} />
                <col style={{width: '60%'}} />
                <col style={{width: '10%'}} />
                <col style={{width: '10%'}} />
            </colgroup>
        );
    }

    renderHead() {
        const sortableColumns = this.headerData.map(header => {
            return (
                <SortableColumn key={header.id} header={header} 
                    orderby={this.state.orderby} 
                    orderasc={this.state.orderasc}
                    setSort={(orderby) => this.setSort(orderby)} />
            );
        });

        return (
            <React.Fragment>
                {sortableColumns}
                <th>Options</th>
            </React.Fragment>
        );
    }

    renderBody(sections) {
        return (
            <React.Fragment>
                {sections.map(s => {
                    return (
                        <tr key={s.id}>
                            <td><Link to={`/section/${s.id}`}>{s.title}</Link></td>
                            <td>{s.content}</td>
                            <td>{(s.inUse ? 'Yes' : 'No')}</td>
                            <td>
                                <EditIcon link={`section/${s.id}/edit`} />
                                <DeleteIcon onClick={() => this.toggleDeleteModal(s.id)} title="Delete" />
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

        let sections = this.getSections();
        const totalItems = sections.length;
        sections = sections.slice(...calculatePageSlice(this.state.page));

        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.deleteModalOpen} 
                    toggleModal={this.toggleDeleteModal} 
                    submitHandler={this.deleteHandler}
                    buttonText={'Delete'}
                    >
                    <p>Are you sure you want to delete this section?</p>
                </ConfirmActionModal>
                <TableContainer columns={this.renderColumns} 
                    thead={this.renderHead} 
                    tbody={this.renderBody}
                    items={sections}
                    setPage={(page) => this.setPage(page)}
                    currPage={this.state.page}
                    totalItems={totalItems}
                    />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(SectionsTable);