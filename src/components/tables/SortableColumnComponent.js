import React from 'react';
import { Button } from 'reactstrap';

function SortableColumn(props) {
    let arrow = <span></span>;
    if (props.header.orderby === props.orderby) {
        if (props.orderasc) {
            arrow = <span className="fa fa-sort-asc"></span>;
        } else {
            arrow = <span className="fa fa-sort-desc"></span>;
        }
    }

    return (
        <th>
            <Button color="link" onClick={() => props.setSort(props.header.orderby)}>
                {props.header.title} {arrow}
            </Button>
        </th>
    );
}

export default SortableColumn;