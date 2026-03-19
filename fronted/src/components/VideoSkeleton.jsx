import React from 'react';
import '../styles/home.css';

const VideoSkeleton = () => {
    return (
        <div className="video-card skeleton-card">
            <div className="skeleton-video pulse"></div>
            
            <div className="actions-sidebar">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="action-btn">
                        <div className="icon-container skeleton-icon pulse"></div>
                        <div className="skeleton-text pulse" style={{ width: '20px', height: '10px', marginTop: '6px' }}></div>
                    </div>
                ))}
            </div>

            <div className="video-overlay">
                <div className="content-wrapper skeleton-wrapper">
                    <div className="partner-badge skeleton-badge pulse"></div>
                    <div className="dish-name skeleton-title pulse"></div>
                    <div className="dish-description skeleton-desc pulse"></div>
                    <div className="dish-description skeleton-desc-short pulse"></div>
                    <div className="visit-store-btn skeleton-btn pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default VideoSkeleton;
