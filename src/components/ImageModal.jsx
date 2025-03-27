// src/components/ImageModal.jsx
import React from 'react';
import './ImageModal.scss';

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Enlarged" />
            </div>
        </div>
    );
};

export default ImageModal;
