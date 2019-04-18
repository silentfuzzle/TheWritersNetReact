import React from 'react';
import { Modal, ModalHeader } from 'reactstrap';

function UnclosableModal(props) {
    return (
        <Modal isOpen={props.isModalOpen}>
            <ModalHeader>{props.title}</ModalHeader>
            {props.children}
        </Modal>
    );
}

export default UnclosableModal;