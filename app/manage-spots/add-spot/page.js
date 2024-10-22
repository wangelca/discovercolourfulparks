"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUploadComponent from "../../components/image-upload.js";
import ValidationComponent from "../../components/validationUtils.js";
import { spotValidationRules } from "../../components/validationRules";
import GenerateDescriptionComponent from "../../components/genDescription.js";
import ErrorAlert from "@/app/components/errorAlert.js";

const AddSpotPage = () => {
  const [formData, setFormData] = useState({
    parkId: "",
    spotName: "",
    spotDescription: "",
    spotAdmission: "",
    spotDiscount: "",
    spotLocation: "",
    category: "",
    openingHour: "00:00:00",
    closingHour: "23:59:00",
    spotLimit: "99999999",
    spotImageUrl: null,
    requiredbooking: false,
  });

  const [summary, setSummary] = useState(null);
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const router = useRouter();
  const validationRules = spotValidationRules;
  const { errors, validate } = ValidationComponent({
    formData,
    validationRules,
  });

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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (file, error) => {
    if (error) {
      setErrors({ ...errors, spotImageUrl: error });
    } else {
      setFormData({ ...formData, spotImageUrl: file });
      setErrors({ ...errors, spotImageUrl: null });
    }
  };

  const handleReview = () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setSummary(formData);
    }
  };

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    formDataObj.append("parkId", formData.parkId);
    formDataObj.append("spotName", formData.spotName);
    formDataObj.append("spotDescription", formData.spotDescription);
    formDataObj.append("spotAdmission", formData.spotAdmission);
    formDataObj.append("spotDiscount", formData.spotDiscount);
    formDataObj.append("spotLocation", formData.spotLocation);
    formDataObj.append("category", formData.category);
    formDataObj.append("requiredbooking", formData.requiredbooking);
    formDataObj.append("openingHour", formData.openingHour);
    formDataObj.append("closingHour", formData.closingHour);
    formDataObj.append("spotLimit", formData.spotLimit);
    if (formData.spotImageUrl) {
      formDataObj.append("spotImageUrl", formData.spotImageUrl); // Append the uploaded image
    }

    try {
      await axios.post("http://localhost:8000/spots/add", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/manage-spots"); // Redirect to the spots list page after success
    } catch (error) {
      console.error("Failed to add spot", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {!summary ? (
        <form className="max-w-2xl mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
          <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a spot
          </h1>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label for="name" className="add-form-label">
                Spot Name
              </label>
              <input
                type="text"
                name="spotName"
                value={formData.spotName}
                onChange={handleInputChange}
                className="add-form-input-field"
                placeholder="Type spot name"
              />
            </div>

            <div className="sm:col-span-2">
              <label for="category" className="add-form-label">
                Related Park ID
              </label>
              <select
                name="parkId"
                value={formData.parkId}
                onChange={(e) => {
                  handleInputChange(e);
                  // Convert e.target.value to the same type as park.parkId if necessary
                  const selectedParkName = parks.find(
                    (park) => park.parkId.toString() === e.target.value
                  )?.name;
                  setSelectedPark(selectedParkName);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select a park</option>
                {parks.map((park) => (
                  <option key={park.parkId} value={park.parkId}>
                    (ID: {park.parkId}) {park.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label for="description" className="add-form-label">
                Spot Description
              </label>
              <textarea
                id="description"
                rows="8"
                name="spotDescription"
                value={formData.spotDescription}
                onChange={handleInputChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write a description here"
              />
              <GenerateDescriptionComponent
                entityName={formData.spotName}
                parkName={selectedPark || "National park in Canada"} // Pass the park's name, not ID
                entityType="spot"
                onDescriptionGenerated={(description) =>
                  setFormData({ ...formData, spotDescription: description })
                }
              />
            </div>

            <div className="w-full">
              <label for="hourlyRate" className="add-form-label">
                Admission (in decimals)
              </label>
              <input
                type="number"
                name="spotAdmission"
                value={formData.spotAdmission}
                onChange={handleInputChange}
                className="add-form-input-field"
                placeholder="50"
              />
            </div>

            <div className="w-full">
              <label for="discount" className="add-form-label">
                Discount (in decimals)
              </label>
              <input
                type="number"
                name="spotDiscount"
                value={formData.spotDiscount}
                onChange={handleInputChange}
                defaultValue="0"
                className="add-form-input-field"
                placeholder="0"
              />
            </div>
            <div>
              <label for="openingHour" className="add-form-label">
                Opening Hour
                <input
                  type="time"
                  name="openingHour"
                  value={formData.openingHour}
                  onChange={handleInputChange}
                  className="add-form-input-field"
                  defaultValue="00:00"
                ></input>
              </label>
            </div>
            <div>
              <label for="closingHour" className="add-form-label">
                Closing Hour
                <input
                  type="time"
                  name="closingHour"
                  value={formData.closingHour}
                  onChange={handleInputChange}
                  className="add-form-input-field"
                  defaultValue="23:59"
                ></input>
              </label>
            </div>
            <div className="w-full">
              <label className="add-form-input-field">Spot Location</label>
              <input
                type="text"
                name="spotLocation"
                value={formData.spotLocation}
                onChange={handleInputChange}
                className="badd-form-input-field"
              />
            </div>
            <div className="w-full">
              <label className="add-form-label">Spot category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="add-form-input-field"
              >
                <option value="">Select a spot category</option>
                <option key="Popular Spots" value="Popular Spots">
                  Popular Spots
                </option>
                <option key="Activities" value="Activities">
                  Activities
                </option>
                <option
                  key="Sites and Attractions"
                  value="Sites and Attractions"
                >
                  Sites and Attractions
                </option>
              </select>
            </div>
            <div className="w-full">
              <label for="spotLimit" className="add-form-label">
                Spot Capacity
              </label>
              <input
                type="number"
                name="spotLimit"
                value={formData.spotLimit}
                onChange={handleInputChange}
                className="add-form-input-field"
                defaultValue={99999999}
              />
            </div>
            <div>
              <ImageUploadComponent
                onFileChange={handleFileChange}
                errors={errors.spotImageUrl}
              />
            </div>
            <div>
              <label className="add-form-label">
                <input
                  type="checkbox"
                  name="requiredbooking"
                  checked={formData.requiredbooking}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Required Booking
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleReview}
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Review
              </button>
            </div>
          </div>
          {/* Error message alert */}
          <ErrorAlert errors={errors} />
        </form>
      ) : (
        <div className="container mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Summary</h1>
          {/* Spot Content */}
          <div className="p-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {summary.spotName}
            </h2>
            {/* Spot Image */}
            {summary.spotImageUrl && (
              <img
                src={URL.createObjectURL(summary.spotImageUrl)}
                alt={`Image of ${summary.spotName}`}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="flex flex-col space-y-4">
              <p className="text-lg">
                <strong className="font-semibold">Park ID:</strong>{" "}
                {summary.parkId}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Location:</strong>{" "}
                {summary.spotLocation}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Category:</strong>{" "}
                {summary.category}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Description:</strong>{" "}
                {summary.spotDescription}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Admission:</strong> $
                {summary.spotAdmission}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Discounted Price:</strong>{" "}
                {summary.spotDiscount}%
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Required Booking: </strong>
                {summary.requiredbooking ? "True" : "False"}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Business Hour:</strong>{" "}
                {summary.openingHour} - {summary.closingHour}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSummary(null)}
            className="btn bg-orange-500 text-white mx-3 p-3 rounded-sm"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            className="btn bg-green-500 text-white mx-3 p-3 rounded-sm"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default AddSpotPage;
