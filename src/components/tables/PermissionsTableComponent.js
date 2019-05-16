import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import TableContainer from './TableContainerComponent';
import SortableColumn from './SortableColumnComponent';
import PermissionForm from '../forms/PermissionFormComponent';
import ConfirmActionModal from '../modals/ConfirmActionModalComponent';
import { calculatePageSlice } from '../../utils/pagination';
import DeleteIcon from '../pieces/DeleteIconComponent';

const mapStateToProps = state => {
    // With an actual database, users and reviews would not be necessary here
    return {
        permissions: state.permissions,
        permissionTypes: state.permissionTypes,
        users: state.users
    };
};

class PermissionsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errMess: '',
            permissions: [],
            orderby: '',
            orderasc: true,
            page: 1,
            modalOpen: false,
            selectedPermission: 0
        }

        this.headerData = [
            {
                id: 1,
                orderby: 'username',
                title: 'Username'
            },
            {
                id: 2,
                orderby: 'permission',
                title: 'Permission'
            }
        ];

        this.setSort = this.setSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    fetchPermissions() {
        // This method would fetch the permissions from a database in the required form
        // It may also handle filtering, sorting, and pagination if the database is very large
        this.setState({
            isLoading: true,
            errMess: '',
            permissions: []
        });
        
        setTimeout(() => {
            let permissions = this.props.permissions.filter(p => {
                return p.bookid === this.props.bookid;
            })
            .map(p => {
                const permissionType = this.props.permissionTypes.find(pt => {
                        return pt.id === p.permissionid;
                    });
    
                const user = this.props.users.find(u => u.id === p.userid);
                
                return {
                    ...p,
                    permission: permissionType.name,
                    username: user.username
                };
            });
    
            this.setState({
                isLoading: false,
                errMess: '',
                permissions: permissions
            });
        }, 2000);
    }

    getPermissions() {
        let permissions = this.state.permissions;

        if (this.state.orderby !== '') {
            const orderby = this.state.orderby;

            permissions = permissions.sort((a, b) => {
                return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0)
            });

            if (!this.state.orderasc) {
                permissions = permissions.reverse();
            }
        }

        return permissions;
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

    toggleModal(id = 0) {
        this.setState({
            modalOpen: !this.state.modalOpen,
            selectedPermission: id
        });
    }

    handleChange(event, id) {
        const target = event.target;
        const value = target.value;

        console.log('change permission ' + id + ' to ' + value);
    }

    handleRemove() {
        console.log('remove permission ' + this.state.selectedPermission);
        this.toggleModal(0);
    }

    addPermission(userid, permissionid) {
        console.log('add user ' + userid + ' with permission ' + permissionid);
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

    renderBody(permissions) {
        return (
            <React.Fragment>
                {permissions.map(p => {
                    return (
                        <tr key={p.id}>
                            <th scope="row"><Link to={`/profile/${p.userid}`}>{p.username}</Link></th>
                            <td>
                                <select 
                                    className="form-control" 
                                    value={p.permissionid} 
                                    onChange={(event) => this.handleChange(event, p.id)}
                                    >
                                    {
                                        this.props.permissionTypes.map(pt => {
                                            return (<option key={pt.id} value={pt.id}>{pt.name}</option>);
                                        })
                                    }
                                </select>
                            </td>
                            <td><DeleteIcon onClick={() => this.toggleModal(p.id)} /></td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.fetchPermissions();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Permissions...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.books.errMess}</h4>
            );
        }

        let permissions = this.getPermissions();
        const totalItems = permissions.length;
        permissions = permissions.slice(...calculatePageSlice(this.state.page));

        return (
            <React.Fragment>
                <ConfirmActionModal isModalOpen={this.state.modalOpen} 
                    toggleModal={this.toggleModal} 
                    submitHandler={this.handleRemove}
                    buttonText={'Remove'}>
                    <p>Are you sure you want to remove this user's permissions?</p>
                </ConfirmActionModal>
                <h3 id="permissions">Test</h3>
                <Card>
                    <CardHeader>Permissions</CardHeader>
                    <CardBody>
                        <TableContainer
                            columns={this.renderColumns} 
                            thead={this.renderHead} 
                            tbody={this.renderBody}
                            items={permissions}
                            setPage={(page) => this.setPage(page)}
                            currPage={this.state.page}
                            totalItems={totalItems}
                            />
                    </CardBody>
                    <CardFooter>
                        <PermissionForm 
                            users={this.props.users} 
                            permissionTypes={this.props.permissionTypes}
                            addPermission={this.addPermission}
                            />
                    </CardFooter>
                </Card>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(PermissionsTable);