import React from 'react';

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
            <a href={props.anchor} onClick={() => props.setSort(props.header.orderby)}>
                {props.header.title} {arrow}
            </a>
        </th>
    );
}

export default SortableColumn;