import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function UnclosableModal(props) {
    return (
        <Modal isOpen={props.isModalOpen}>
            <ModalHeader>{props.title}</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    );
}

export default UnclosableModal;