'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditParkPage() {
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    description: '',
    location: '',
    parameters: '',
    parkId:''
  });
  
  const [originalImage, setOriginalImage] = useState(''); 
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { parkId } = useParams();

  useEffect(() => {
    const fetchParkData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/parks/${parkId}`);
        setFormData({
          name: response.data.name,
          province: response.data.province,
          description: response.data.description,
          location: response.data.location,
          parameters: response.data.parameters || '',
          parkId: response.data.parkId || ''
        });
        setOriginalImage(response.data.parkImageUrl[0] || ''); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching park data:', error);
        setIsLoading(false);
      }
    };

    fetchParkData();
  }, [parkId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Enter a valid park name';
    if (!formData.province) newErrors.province = 'A province must be selected';
    if (!formData.description) newErrors.description = 'Enter a valid description';
    if (!formData.location) newErrors.location = 'Enter a valid location';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const updatedData = {
        parkId: formData.parkId,
        name: formData.name,
        province: formData.province,
        description: formData.description,
        location: formData.location,
        parameters: formData.parameters || '',
        parkImageUrl: [originalImage],
    };

    console.log("Updated Data to be sent:", updatedData);

    try {
        const response = await axios.put(`http://localhost:8000/parks/${parkId}`, updatedData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Park updated successfully!');

        router.push(`/parks/${response.data.parkId}`);
    } catch (error) {
        console.error('Error updating park:', error.response?.data || error.message);
        alert('Error updating park: ' + JSON.stringify(error.response?.data || error.message));
    }
};



  return (
    <div className="container mx-auto p-6 bg-gray-100 shadow-md rounded-lg max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Park</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Park Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Province</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="input border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Province</option>
            <option value="Alberta">Alberta</option>
            <option value="British Columbia">British Columbia</option>
          </select>
          {errors.province && <span className="text-red-500 text-sm">{errors.province}</span>}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input border border-gray-300 rounded-lg p-3 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="input border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Parameters</label>
          <input
            type="text"
            name="parameters"
            value={formData.parameters}
            onChange={handleInputChange}
            className="input border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.parameters && <span className="text-red-500 text-sm">{errors.parameters}</span>}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Park
          </button>
        </div>
      </form>
    </div>
  );
}



/* Terms of Reference:
Chatgpt prompt: For line24, I'm being redirected instead to http://localhost:3000/manage-parks/edit-park/undefined. 
                My routing was fine before, how do I fix this and what do I change this into so it loads into the proper area?

axios routing: Semi copied from Wui's add branch page, applying the logic she used add parks and the routing to our API

*/



