import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

function MarkdownToHTML({input, addMapLink}) {
    const PageLink = ({ href, children }) => {
        return (
            !isNaN(href) 
                ? <Link to={`/page/${href}`} onClick={() => addMapLink(href)}>{children}</Link>
                : <a href={href} rel="noopener noreferrer" target="_blank">{children}</a>
        );
    }

    return (
        <ReactMarkdown
            source={input}
            renderers={{ link: PageLink }}
            />
    );
}

export default MarkdownToHTML;