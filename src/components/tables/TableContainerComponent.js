import React from 'react';
import { Table } from 'reactstrap';
import PaginationControls from '../pieces/PaginationControlsComponent';
import { calculatePageSlice } from '../../utils/pagination';

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