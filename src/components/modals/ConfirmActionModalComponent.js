import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

function ConfirmActionModal(props) {
    return (
        <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
            <ModalHeader toggle={props.toggleModal}>Confirm Action</ModalHeader>
            <ModalBody>
                {props.children}
                <div class="row justify-content-end">
                    <div class="col-auto">
                        <Button color="secondary" onClick={props.toggleModal}>Cancel</Button> 
                        <Button color="danger" onClick={props.submitHandler}>{this.props.buttonText}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}

export default ConfirmActionModal;