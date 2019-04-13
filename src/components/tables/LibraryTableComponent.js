import React, { Component } from 'react';
import TableContainer from './TableContainerComponent';

class LibraryTable extends Component {
    renderHead() {
        return (
            <React.Fragment>
                <th>Test1</th>
                <th>Test2</th>
            </React.Fragment>
        );
    }

    renderBody() {
        return (
            <tr>
                <th>Test1</th>
                <td>Test2</td>
            </tr>
        );
    }

    render() {
        return (
            <TableContainer thead={this.renderHead} tbody={this.renderBody} />
        );
    }
}

export default LibraryTable;