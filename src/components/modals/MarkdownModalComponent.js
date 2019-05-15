import React from 'react';
import { ModalBody } from 'reactstrap';
import HelpModal from './HelpModalComponent';

function MarkdownModal(props) {
    return (
        <HelpModal 
            title={'Markdown Helper'}
            isModalOpen={props.isModalOpen}
            toggleModal={props.toggleModal}
            >
            <ModalBody>
                <p>Insert markdown instructions here.</p>
            </ModalBody>
        </HelpModal>
    );
}

export default MarkdownModal;