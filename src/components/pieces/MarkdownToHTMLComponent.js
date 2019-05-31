import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownToHTML({input}) {
    return (
        <ReactMarkdown source={input} />
    );
}

export default MarkdownToHTML;