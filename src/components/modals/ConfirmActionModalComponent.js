import React from 'react';
import { Button } from 'reactstrap';
import ClosableModal from '../modals/ClosableModalComponent';

function ConfirmActionModal(props) {
    return (
        <ClosableModal title={'Confirm Action'} isModalOpen={props.isModalOpen} toggleModal={props.toggleModal}>
            {props.children}
            <div className="row justify-content-end">
                <div className="col-auto">
                    <Button color="secondary" onClick={props.toggleModal} className="mr-1">Cancel</Button> 
                    <Button color="danger" onClick={props.submitHandler}>{props.buttonText}</Button>
                </div>
            </div>
        </ClosableModal>
    );
}

export default ConfirmActionModal;