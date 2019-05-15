import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { calculateLastPage } from '../../utils/pagination';

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
                    <PaginationLink first href='#'
                        onClick={() => props.setPage(1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous href='#'
                        onClick={() => props.setPage(props.currPage - 1)} />
                </PaginationItem>
            </React.Fragment>
        );
    }
    if (props.currPage !== lastPage && lastPage > 0) {
        nextControls = (
            <React.Fragment>
                <PaginationItem>
                    <PaginationLink next href='#' 
                        onClick={() => props.setPage(props.currPage + 1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href='#'
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

export default PaginationControls;