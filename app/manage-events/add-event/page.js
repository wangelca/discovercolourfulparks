"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUploadComponent from "../../components/image-upload.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEventPage = () => {
  const [formData, setFormData] = useState({
    parkId: "",
    eventName: "",    
    eventLocation: "",
    description: "",
    fee: "",
    discount: "",
    eventImageUrl: null,
    startDate: "",
    endDate: "",
    requiredbooking: false,
  });
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState(null);
  const [parks, setParks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/parks");
        setParks(response.data);
      } catch (error) {
        console.error("Error fetching parks", error);
      }
    };

    fetchParks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "fee" || name === "discount") {
      if (value < 0 || value > 9999) {
        setErrors({
          ...errors,
          [name]: `${
            name === "fee" ? "Fee" : "Discount"
          } must be between 0 and 9999`,
        });
      } else {
        setErrors({
          ...errors,
          [name]: null, // Clear error when within range
        });
      }
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (date, fieldName) => {
    setFormData({ ...formData, [fieldName]: date });
  };

  const handleFileChange = (file, error) => {
    if (error) {
      setErrors({ ...errors, eventImageUrl: error });
    } else {
      setFormData({ ...formData, eventImageUrl: file });
      setErrors({ ...errors, eventImageUrl: null });
    }
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.parkId) newErrors.parkId = "Park ID is required";
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (
      !formData.fee ||
      isNaN(formData.fee) ||
      formData.fee < 0 ||
      formData.fee > 9999
    ) {
      newErrors.fee = "Fee must be between 0 and 9999";
    }
    if (
      !formData.discount ||
      isNaN(formData.discount) ||
      formData.discount < 0 ||
      formData.discount > 9999 ||
      formData.discount > formData.fee
    ) {
      newErrors.discount = "Discount must be between 0 and 9999, and less than fee";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.eventLocation) newErrors.eventLocation = "Location is required";
    if (formData.startDate > formData.endDate) newErrors.startDate = "Start date must be before end date";
    if (!formData.eventImageUrl)
      newErrors.eventImageUrl = "Event image is required";
    setErrors(newErrors); 
    console.log("Validation errors:", newErrors);  // Log the errors to see if any exist
     return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validateInput()) {
      setSummary(formData);
      console.log("Summary Data:", formData);  // Log to see what data is being set
    }
  };

  const handleSubmit = async () => {

    const formDataObj = new FormData();
    formDataObj.append("parkId", formData.parkId);
    formDataObj.append("eventName", formData.eventName);
    formDataObj.append("description", formData.description);
    formDataObj.append("fee", formData.fee);
    formDataObj.append("discount", formData.discount);
    formDataObj.append("eventLocation", formData.eventLocation);
    formDataObj.append("requiredbooking", formData.requiredbooking);
    formDataObj.append("startDate", formData.startDate.toISOString().slice(0, 19));
    formDataObj.append("endDate", formData.endDate.toISOString().slice(0, 19));
    if (formData.eventImageUrl) {
      formDataObj.append("eventImageUrl", formData.eventImageUrl);  // Append the uploaded image
  }

    try {
      await axios.post("http://localhost:8000/events/add", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/manage-events"); 
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {!summary ? (
        <form className="max-w-lg mx-auto">
          <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add an Event
          </h2>
          <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">      
                Event Name
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type event name"
              />
              {errors.eventName && (
                <span className="text-red-500">{errors.eventName}</span>
              )}
            </div>

            <div class="sm:col-span-2">
              <label
                for="category"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Related Park ID
              </label>
              <select
                name="parkId"
                value={formData.parkId}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select a park</option>
                {parks.map((park) => (
                  <option key={park.parkId} value={park.parkId}>
                    (ID: {park.parkId}) {park.name}
                  </option>
                ))}
              </select>
              {errors.parkId && (
                <span className="text-red-500">{errors.parkId}</span>
              )}
            </div>

            <div class="sm:col-span-2">
              <label
                for="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Event Description
              </label>
              <textarea
                id="description"
                rows="8"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write a description here"
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>

            <div class="w-full">
              <label
                for="fee"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Fee (in decimals)
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="50"
              />
              {errors.fee && (
                <span className="text-red-500">{errors.fee}</span>
              )}
            </div>

            <div class="w-full">
              <label
                for="discount"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Discount (in decimals)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0"
              />
              {errors.discount && (
                <span className="text-red-500">{errors.discount}</span>
              )}
            </div>
            <div class="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Start Date & Time
              </label>
              <DatePicker
              showIcon
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, "startDate")}
              showTimeSelect
              dateFormat="Pp"              
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
              {errors.startDate && (
                <span className="text-red-500">{errors.startDate}</span>
              )}
            </div>
            <div class="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                End Date & Time
              </label>
              <DatePicker
              showIcon
              selected={formData.endDate}
              onChange={(date) => handleDateChange(date, "endDate")}
              showTimeSelect
              dateFormat="Pp"              
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
              {errors.endDate && (
                <span className="text-red-500">{errors.endDate}</span>
              )}
            </div>

            <div class="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Event Location
              </label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              {errors.eventLocation && (
                <span className="text-red-500">{errors.eventLocation}</span>
              )}
            </div>
            <div>
              <ImageUploadComponent
                onFileChange={handleFileChange}
                errors={errors.eventImages}
              />
            </div>

            <div>
              <label className="inline-flex items-center mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  name="requiredbooking"
                  checked={formData.requiredbooking}
                  onChange={handleInputChange} // Keep your change handler
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Required Booking
                </span>
              </label>
            </div>

            <div class="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleReview}
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Review
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="container mx-auto p-6">
          <h1>Summary</h1>
          To update the review layout
          <button
            onClick={handleSubmit}
            className="btn bg-green-500 text-white"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEventPage;
