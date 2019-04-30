import React from 'react';
import { Button } from 'reactstrap';
import ClosableModal from '../modals/ClosableModalComponent';

function HelpModal({title, isModalOpen, toggleModal, children}) {
    return (
        <ClosableModal title={title} 
            isModalOpen={isModalOpen} 
            toggleModal={toggleModal}
        >
            {children}
            <div className="row justify-content-end">
                <div className="col-auto">
                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                </div>
            </div>
        </ClosableModal>
    );
}

export default HelpModal;