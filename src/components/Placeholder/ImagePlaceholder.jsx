import React from 'react';
import { Image } from 'lucide-react';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ imageId, altText, type = 'default' }) => {
    const isRemote = imageId?.startsWith('http');
    // We use a relative path from the project base. Vite's BASE_URL includes the trailing slash.
    const imagePath = isRemote ? imageId : (imageId ? `${import.meta.env.BASE_URL}assets/images/${imageId}.jpg` : null);

    return (
        <div className={`image-placeholder type-${type}`}>
            {imagePath ? (
                <img
                    src={imagePath}
                    alt={altText || imageId}
                    className="placeholder-image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            <div className="placeholder-content" style={{ display: imagePath ? 'none' : 'flex' }}>
                <Image size={32} className="placeholder-icon" />
                <span className="placeholder-text">Foto: {imageId}</span>
                {altText && <span className="placeholder-alt">{altText}</span>}
            </div>
            {/* Visual pattern background */}
            {!imagePath && <div className="placeholder-pattern"></div>}
        </div>
    );
};

export default ImagePlaceholder;
