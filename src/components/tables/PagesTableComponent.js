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
        pages: state.pages
    }
}

class PagesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteModalOpen: false,
            selectedPage: 0,
            isLoading: false,
            errMess: '',
            pages: [],
            orderby: '',
            orderasc: true,
            page: 1
        }

        this.headerData = [
            {
                id: 1,
                orderby: 'id',
                title: 'ID',
            },
            {
                id: 2,
                orderby: 'title',
                title: 'Title'
            }
        ];

        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    fetchPages() {
        // This method would fetch the books from a database in the required form
        // It may also handle filtering, sorting, and pagination if the database is very large
        this.setState({
            isLoading: true,
            errMess: '',
            pages: []
        });
        
        setTimeout(() => {
            const pages = this.props.pages.filter(p => p.bookid === this.props.bookid);
    
            this.setState({
                isLoading: false,
                errMess: '',
                pages: pages
            });
        }, 2000);
    }

    getPages() {
        let pages = this.state.pages;

        if (this.state.orderby !== '') {
            const orderby = this.state.orderby;

            pages = pages.sort((a, b) => {
                return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0)
            });

            if (!this.state.orderasc) {
                pages = pages.reverse();
            }
        }

        return pages;
    }

    toggleDeleteModal(pageid = 0) {
        this.setState({
            deleteModalOpen: !this.state.deleteModalOpen,
            selectedPage: pageid
        });
    }

    deleteHandler() {
        console.log(this.state.selectedPage);
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
            <colgroup></colgroup>
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

    renderBody(pages) {
        return (
            <React.Fragment>
                {pages.map(p => {
                    return (
                        <tr key={p.id}>
                            <th scope="row">{p.id}</th>
                            <td><Link to={`/page/${p.id}`}>{p.title}</Link></td>
                            <td>
                                <EditIcon link={`page/${p.id}/edit`} />
                                <DeleteIcon onClick={() => this.toggleDeleteModal(p.id)} title="Delete" />
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.fetchPages();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Pages...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        let pages = this.getPages();
        const totalItems = pages.length;
        pages = pages.slice(...calculatePageSlice(this.state.page));

        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.deleteModalOpen} 
                    toggleModal={this.toggleDeleteModal} 
                    submitHandler={this.deleteHandler}
                    buttonText={'Delete'}
                    >
                    <p>Are you sure you want to delete this page?</p>
                </ConfirmActionModal>
                <TableContainer columns={this.renderColumns} 
                    thead={this.renderHead} 
                    tbody={this.renderBody}
                    items={pages}
                    setPage={(page) => this.setPage(page)}
                    currPage={this.state.page}
                    totalItems={totalItems}
                    />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(PagesTable);