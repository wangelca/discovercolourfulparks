// validationRules.js
export const eventValidationRules = [
    { field: 'parkId', type: 'required', label: 'Park ID' },
    { field: 'eventName', type: 'required', label: 'Event Name' },
    { field: 'description', type: 'required', label: 'Description' },
    { field: 'fee', type: 'number', label: 'Fee', min: 0, max: 9999 },
    { field: 'discount', type: 'number', label: 'Discount', min: 0, max: 9999 },
    { field: 'startDate', type: 'required', label: 'Start Date' },
    { field: 'endDate', type: 'required', label: 'End Date' },
    { field: 'startDate', type: 'date', label: 'Start Date', compareWith: 'endDate', compareLabel: 'End Date' },
    { field: 'eventLocation', type: 'required', label: 'Event Location' },
    { field: 'eventImageUrl', type: 'required', label: 'Event Image' },
  ];
  
  export const spotValidationRules = [
    { field: 'parkId', type: 'required', label: 'Park ID' },
    { field: 'spotName', type: 'required', label: 'Spot Name' },
    { field: 'spotDescription', type: 'required', label: 'Spot Description' },
    { field: 'spotAdmission', type: 'number', label: 'Admission', min: 0, max: 9999 },
    { field: 'spotDiscount', type: 'number', label: 'Discount', min: 0, max: 9999 },
    { field: 'spotLocation', type: 'required', label: 'Location' },
    { field: 'spotImageUrl', type: 'required', label: 'Spot Image' },
  ];
  