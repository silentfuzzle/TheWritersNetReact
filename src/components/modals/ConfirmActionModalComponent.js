import React from 'react';
import { ModalBody, Button } from 'reactstrap';
import ClosableModal from '../modals/ClosableModalComponent';

function ConfirmActionModal(props) {
    return (
        <ClosableModal title={'Confirm Action'} isModalOpen={props.isModalOpen} toggleModal={props.toggleModal}>
            <ModalBody>
                {props.children}
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <Button color="secondary" onClick={props.toggleModal} className="mr-1">Cancel</Button> 
                        <Button color="danger" onClick={props.submitHandler}>{props.buttonText}</Button>
                    </div>
                </div>
            </ModalBody>
        </ClosableModal>
    );
}

export default ConfirmActionModal;