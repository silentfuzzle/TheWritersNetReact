import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function ClosableModal(props) {
    return (
        <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
            <ModalHeader  toggle={props.toggleModal}>{props.title}</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    );
}

export default ClosableModal;