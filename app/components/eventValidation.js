import { useState } from 'react';

export default function useEventValidation(initialState) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (date, fieldName) => {
    setFormData({ ...formData, [fieldName]: date });
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.parkId) newErrors.parkId = "Park ID is required";
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.fee || isNaN(formData.fee) || formData.fee < 0 || formData.fee > 9999) {
      newErrors.fee = "Fee must be between 0 and 9999";
    }
    if (!formData.discount || isNaN(formData.discount) || formData.discount < 0 || formData.discount > 9999 || formData.discount > formData.fee) {
      newErrors.discount = "Discount must be between 0 and 9999, and less than fee";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.eventLocation) newErrors.eventLocation = "Location is required";
    if (formData.startDate > formData.endDate) newErrors.startDate = "Start date must be before end date";
    if (!formData.eventImageUrl) newErrors.eventImageUrl = "Event image is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    setFormData,
    setErrors,
    handleInputChange,
    handleDateChange,
    validateInput,
  };
}
