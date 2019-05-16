import React from 'react';
import { Button } from 'reactstrap';

function DeleteIcon({onClick, title}) {
    return (
        <Button color="link" onClick={onClick}><span className="fa fa-remove" title={title}></span></Button>
    );
}

export default DeleteIcon;