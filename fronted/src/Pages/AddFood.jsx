import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddFood.css';

const AddFood = () => {
    const navigate = useNavigate();
    const [videoPreview, setVideoPreview] = React.useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleRemoveVideo = () => {
        setVideoPreview(null);
        // Reset file input value if needed (requires ref)
        document.getElementById('video-input').value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData();

        formData.append("name", form.name.value);
        formData.append("description", form.description.value);

        const fileInput = form.querySelector('input[name="file"]');
        if (fileInput && fileInput.files[0]) {
            formData.append("video", fileInput.files[0]);
        }

        try {
            const response = await axios.post('https://krishka-kitchen-2.onrender.com/api/food', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.status === 201) {
                alert("Food Item Added Successfully!");
                form.reset();
                setVideoPreview(null);
                navigate('/partner/profile');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add food");
        }
    };

    return (
        <div className="add-food-container">
            <div className="add-food-card">
                <div className="add-food-header">
                    <h1 className="add-food-title">Add New Dish</h1>
                    <p className="add-food-subtitle">Showcase your culinary masterpiece</p>
                </div>

                <form className="add-food-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Dish Name</label>
                        <input type="text" name="name" className="form-input" placeholder="e.g. Butter Chicken" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" placeholder="Describe the taste, ingredients, and story..." required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Food Video</label>

                        {!videoPreview ? (
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="video-input"
                                    name="file"
                                    className="file-upload-input"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                <div className="file-upload-placeholder">
                                    <span className="upload-icon">🎥</span>
                                    <span>Click to upload video</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>Max size: 50MB</span>
                                </div>
                            </div>
                        ) : (
                            <div className="video-preview-container">
                                <video src={videoPreview} controls className="video-preview" />
                                <button type="button" className="remove-video-btn" onClick={handleRemoveVideo} title="Remove Video">×</button>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn">Add to Menu</button>
                    <button type="button" onClick={() => navigate('/partner/profile')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '10px' }}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddFood;
