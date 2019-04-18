import React from 'react';
import { Modal, ModalHeader } from 'reactstrap';

function ClosableModal(props) {
    return (
        <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
            <ModalHeader  toggle={props.toggleModal}>{props.title}</ModalHeader>
            {props.children}
        </Modal>
    );
}

export default ClosableModal;