// ValidationComponent.js
import React, { useState } from 'react';

const ValidationComponent = ({ formData, validationRules }) => {
  const [errors, setErrors] = useState({});

  const validateFormData = () => {
    const newErrors = {};

    validationRules.forEach(rule => {
      if (rule.type === 'required' && !formData[rule.field]) {
        newErrors[rule.field] = `${rule.label} is required`;
      }

      if (rule.type === 'number' && (isNaN(formData[rule.field]) || formData[rule.field] < rule.min || formData[rule.field] > rule.max)) {
        newErrors[rule.field] = `${rule.label} must be between ${rule.min} and ${rule.max}`;
      }

      if (rule.type === 'date' && formData[rule.field] && formData[rule.compareWith] && formData[rule.field] > formData[rule.compareWith]) {
        newErrors[rule.field] = `${rule.label} must be before ${rule.compareLabel}`;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  // Validate and return errors for use in parent component
  return {
    errors,
    validate: validateFormData,
  };
};

export default ValidationComponent;
