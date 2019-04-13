import React from 'react';
import { Jumbotron, Button } from 'reactstrap';
import LibraryTable from '../tables/LibraryTableComponent';

function Home(props) {
    return (
        <React.Fragment>
            <Jumbotron>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>The Writer's Net</h1>
                            <h2>A website for reading, writing, and sharing non-linear fiction</h2>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <Button color="success" onClick={props.toggleSignupModal}>Signup</Button>
                        </div>
                    </div>
                </div>
            </Jumbotron>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2>About</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus condimentum nulla et ultricies mattis. Sed bibendum quam in nibh tempor lobortis. Vivamus consectetur mauris ex, sit amet porttitor dolor fermentum et. Aliquam ornare justo vel tempor laoreet. In in eleifend nisi. Maecenas consectetur nec purus in mollis. Donec sit amet dolor fringilla, commodo sapien id, tempor enim. Integer ac eleifend ante. Donec dignissim, quam iaculis aliquet blandit, dui turpis placerat metus, in viverra ipsum sem id justo. Pellentesque tempus metus ut nisl placerat, sit amet pulvinar lectus rutrum. Nunc consequat purus sed libero rhoncus, in gravida turpis convallis. Duis dignissim ornare ipsum et dictum. Integer ipsum nulla, mattis ac volutpat vel, interdum a leo.</p>

                        <p>Vivamus viverra velit sed gravida facilisis. Nam id elit sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur at dui eu nisi mollis ullamcorper ac porttitor diam. Praesent sagittis nulla porta dui venenatis fringilla. Curabitur augue tortor, efficitur non dolor ut, laoreet bibendum erat. Suspendisse potenti. Sed eleifend ipsum velit, non tempus metus vehicula vitae. Ut quis turpis id lectus interdum facilisis eget nec libero. Praesent ut mollis tortor, sit amet sagittis mauris.</p>
                        
                        <p>Donec fermentum semper est, ut dignissim ante consequat a. Quisque ornare cursus augue. Duis ut nibh eu risus pharetra pellentesque. Proin facilisis, nunc id gravida pellentesque, velit metus viverra elit, vel molestie elit erat nec sapien. Donec ac felis tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus nunc quam, accumsan quis varius vitae, luctus mattis enim. Fusce eget luctus tortor, a auctor eros. Donec eget consequat erat. In hac habitasse platea dictumst.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>Library</h2>
                    </div>
                </div>
                <LibraryTable />
            </div>
        </React.Fragment>
    );
}

export default Home