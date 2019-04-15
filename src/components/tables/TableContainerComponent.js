import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

function PaginationControls(props) {
    return (
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
                        <PaginationLink disabled>1</PaginationLink>
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
    );
}

function TableContainer(props) {
    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Table responsive hover>
                        {props.columns()}
                        <thead className="thead-dark">
                            <tr>
                                {props.thead()}
                            </tr>
                        </thead>
                        <tbody>
                            {props.tbody()}
                        </tbody>
                    </Table>
                </div>
            </div>
            <PaginationControls />
        </React.Fragment>
    );
}

export default TableContainer;