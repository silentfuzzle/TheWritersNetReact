import React from 'react';
import { Link } from 'react-router-dom';

function ViewIcon({link, title}) {
    return (
        <Link to={link}><span className="fa fa-eye" title={title}></span></Link>
    );
}

export default ViewIcon;