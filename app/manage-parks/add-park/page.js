import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const provinces = ['Ontario', 'British Columbia', 'Alberta', 'Quebec'];

const AddParkPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    description: '',
    location: '',
    parkImage: null,
    parameters
  });
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      parkImage: e.target.files[0],
    });
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.province) newErrors.province = 'Please select a province';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.parkImage) newErrors.parkImage = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validateInput()) {
      setSummary(formData);
    }
  };

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('province', formData.province);
    formDataObj.append('description', formData.description);
    formDataObj.append('location', formData.location);
    formDataObj.append('parkImage', formData.parkImage);

    try {
      await axios.post('http://localhost:8000/parks/add', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/parks'); // Redirect to the parks list page after success
    } catch (error) {
      console.error('Failed to add park', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {!summary ? (
        <form>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input"
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
          </div>

          <div>
            <label>Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Select a province</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province && (
              <span className="text-red-500">{errors.province}</span>
            )}
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input"
            />
            {errors.description && (
              <span className="text-red-500">{errors.description}</span>
            )}
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input"
            />
            {errors.location && (
              <span className="text-red-500">{errors.location}</span>
            )}
          </div>

          <div>
            <label>Park Image</label>
            <input type="file" onChange={handleFileChange} className="input" />
            {errors.parkImage && (
              <span className="text-red-500">{errors.parkImage}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleReview}
            className="btn bg-blue-500 text-white"
          >
            Review
          </button>
        </form>
      ) : (
        <div>
          <h3>Summary</h3>
          <p>Name: {summary.name}</p>
          <p>Province: {summary.province}</p>
          <p>Description: {summary.description}</p>
          <p>Location: {summary.location}</p>
          <p>Image: {summary.parkImage.name}</p>
          <button onClick={handleSubmit} className="btn bg-green-500 text-white">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default AddParkPage;
