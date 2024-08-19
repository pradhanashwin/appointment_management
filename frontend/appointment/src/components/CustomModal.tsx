// src/components/CustomModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';

interface CustomModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    title: string;
    content: JSX.Element;
    onSave: () => void;
    onDelete?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, title, content, onSave, onDelete }) => {
    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header >
                
                <div className="icons">
                <FontAwesomeIcon className="fa-icons fa-xmark" icon={faXmark} onClick={onRequestClose}/>
                    {onDelete && <FontAwesomeIcon className="fa-icons fa-trash" icon={faTrashCan} />}
                </div>
            
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>Close</Button>
                <Button variant="primary" onClick={onSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;
