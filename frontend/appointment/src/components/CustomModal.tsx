// src/components/CustomModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

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
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                {onDelete && <Button variant="danger" onClick={onDelete}>Delete</Button>}
                <Button variant="secondary" onClick={onRequestClose}>Close</Button>
                <Button variant="primary" onClick={onSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;
