import React from 'react';
import { Link } from 'react-router-dom';

function EditIcon({link}) {
    return (
        <Link to={link}><span className="fa fa-pencil" title="Edit"></span></Link>
    );
}

export default EditIcon;