import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { calculateLastPage, calculatePageSlice } from '../../utils/pagination';

function PaginationControls(props) {
    let lastPage = calculateLastPage(props.numItems);

    let prevControls = (
        <span></span>
    );
    let nextControls = (
        <span></span>
    )

    if (props.currPage > 1) {
        prevControls = (
            <React.Fragment>
                <PaginationItem>
                    <PaginationLink first href={props.anchor} 
                        onClick={() => props.setPage(1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous href={props.anchor} 
                        onClick={() => props.setPage(props.currPage - 1)} />
                </PaginationItem>
            </React.Fragment>
        );
    }
    if (props.currPage !== lastPage) {
        nextControls = (
            <React.Fragment>
                <PaginationItem>
                    <PaginationLink next href={props.anchor} 
                        onClick={() => props.setPage(props.currPage + 1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href={props.anchor} 
                        onClick={() => props.setPage(lastPage)} />
                </PaginationItem>
            </React.Fragment>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-auto">
                <Pagination aria-label="Table Pagination">
                    {prevControls}
                    <PaginationItem>
                        <PaginationLink disabled>{props.currPage}</PaginationLink>
                    </PaginationItem>
                    {nextControls}
                </Pagination>
            </div>
        </div>
    );
}

function TableContainer(props) {
    const pageSlice = calculatePageSlice(props.currPage);

    return (
        <React.Fragment>
            <div className="row justify-content-end">
                <div className="col-auto">
                    <p>Showing results {pageSlice[0] + 1} - {pageSlice[0] + props.items.length} of {props.totalItems}.</p>
                </div>
            </div>
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
                            {props.tbody(props.items)}
                        </tbody>
                    </Table>
                </div>
            </div>
            <PaginationControls
                anchor={props.anchor}
                setPage={props.setPage}
                currPage={props.currPage}
                numItems={props.totalItems} />
        </React.Fragment>
    );
}

export default TableContainer;