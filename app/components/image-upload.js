import { useState } from 'react';

const ImageUploadComponent = ({ onFileChange, imageError }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedImage(null);
    const file = e.target.files[0];
    const allowedFormats = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedFormats.includes(file.type)) {
      onFileChange(null, "Only JPEG and PNG formats are allowed");
      return;
    }

    if (file.size > maxSize) {
      onFileChange(null, "File size should not exceed 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          onFileChange(null, "Image resolution should be at least 800x600 pixels");
          return;
        }
        setSelectedImage(URL.createObjectURL(file));
        onFileChange(file, null); // File is valid
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="add-form-label">
        Upload Image
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      />
      {imageError && <span className="error-message">{imageError}</span>}
      {selectedImage && (
        <div className="mt-4">
          <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover" />
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
