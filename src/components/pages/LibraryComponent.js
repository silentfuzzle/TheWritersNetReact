import React from 'react';
import LibraryTable from '../tables/LibraryTableComponent';

function Library(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Library</h1>
                    <p>Donec fermentum semper est, ut dignissim ante consequat a. Quisque ornare cursus augue. Duis ut nibh eu risus pharetra pellentesque. Proin facilisis, nunc id gravida pellentesque, velit metus viverra elit, vel molestie elit erat nec sapien. Donec ac felis tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus nunc quam, accumsan quis varius vitae, luctus mattis enim. Fusce eget luctus tortor, a auctor eros. Donec eget consequat erat. In hac habitasse platea dictumst.</p>
                </div>
            </div>
        <LibraryTable />
        </div>
    );
}

export default Library;