import React, { useState } from "react";
import axios from "axios";

const ReportSightingForm = () => {
  const [formData, setFormData] = useState({
    animalType: "",
    latitude: "",
    longitude: "",
    description: "",
    reportedBy: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/sightings/",
        formData
      );
      alert("Sighting reported successfully!");
      setFormData({
        animalType: "",
        latitude: "",
        longitude: "",
        description: "",
        reportedBy: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to report sighting.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Animal Type</label>
        <input
          type="text"
          name="animalType"
          value={formData.animalType}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Latitude</label>
        <input
          type="number"
          name="latitude"
          step="any"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Longitude</label>
        <input
          type="number"
          name="longitude"
          step="any"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label>Reported By</label>
        <input
          type="text"
          name="reportedBy"
          value={formData.reportedBy}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Report Sighting</button>
    </form>
  );
};

export default ReportSightingForm;
