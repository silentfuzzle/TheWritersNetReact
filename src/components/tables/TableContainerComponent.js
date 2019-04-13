import React, { Component } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class TableContainer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <Table responsive hover>
                            <thead className="thead-dark">
                                <tr>
                                    {this.props.thead()}
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.tbody()}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Pagination aria-label="Table Pagination">
                            <PaginationItem>
                                <PaginationLink first href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink previous href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink disabled href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink next href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink last href="#" />
                            </PaginationItem>
                        </Pagination>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TableContainer;