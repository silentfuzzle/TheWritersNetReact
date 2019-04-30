import React, { Component } from 'react';
import PaginationControls from '../pieces/PaginationControlsComponent';

class ReviewsList extends Component {
    render() {
        return (
            <PaginationControls
                anchor={props.anchor}
                setPage={props.setPage}
                currPage={props.currPage}
                numItems={props.totalItems} />
        );
    }
}