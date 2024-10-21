"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUploadComponent from "../../components/image-upload.js";

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

  const validateInput = () => {
    const newErrors = {};
    if (!formData.parkId) newErrors.parkId = "Park ID is required";
    if (!formData.spotName) newErrors.spotName = "Spot name is required";
    if (!formData.spotDescription)
      newErrors.spotDescription = "Description is required";
    if (
      !formData.spotAdmission ||
      isNaN(formData.spotAdmission) ||
      formData.spotAdmission < 0 ||
      formData.spotAdmission > 1000
    ) {
      newErrors.spotAdmission = "Admission must be between 0 and 1000";
    }
    if (
      !formData.spotDiscount ||
      isNaN(formData.spotDiscount) ||
      formData.spotDiscount < 0 ||
      formData.spotDiscount > 1000
    ) {
      newErrors.spotDiscount = "Discount must be between 0 and 1000";
    }
    if (formData.spotAdmission < formData.spotDiscount) {
      newErrors.spotDiscount = "Discount must be less than the admission price";
    }
    if (!formData.openingHour || !formData.closingHour) {
      newErrors.openingHour = "Opening and closing hours are required";
    } else if (formData.openingHour >= formData.closingHour) {
      newErrors.openingHour = "Opening hour must be earlier than closing hour";
      newErrors.closingHour = "Closing hour must be later than opening hour";
    }
    if (
      !formData.spotLimit ||
      formData.spotLimit < 1 ||
      formData.spotLimit > 99999999
    ) {
      newErrors.spotLimit =
        "Spot capacity should be between 1 to 99999999 (i.e no limit).";
    }
    if (!formData.spotLocation) newErrors.spotLocation = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.spotImageUrl)
      newErrors.spotImageUrl = "Spot image is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validateInput()) {
      setSummary(formData);
    }
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      return; // Prevent submission if validation fails
    }
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
        <form className="max-w-lg mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a spot
          </h2>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Spot Name
              </label>
              <input
                type="text"
                name="spotName"
                value={formData.spotName}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type spot name"
              />
              {errors.spotName && (
                <span className="text-red-500">{errors.spotName}</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                for="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                <span className="bg-red-500">{errors.parkId}</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                for="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
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
              {errors.spotDescription && (
                <span className="bg-red-500">{errors.spotDescription}</span>
              )}
            </div>

            <div className="w-full">
              <label
                for="hourlyRate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Admission (in decimals)
              </label>
              <input
                type="number"
                name="spotAdmission"
                value={formData.spotAdmission}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="50"
              />
              {errors.spotAdmission && (
                <span className="bg-red-500">{errors.spotAdmission}</span>
              )}
            </div>

            <div className="w-full">
              <label
                for="discount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Discount (in decimals)
              </label>
              <input
                type="number"
                name="spotDiscount"
                value={formData.spotDiscount}
                onChange={handleInputChange}
                defaultValue="0"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0"
              />
              {errors.spotDiscount && (
                <span className="bg-red-500">{errors.spotDiscount}</span>
              )}
            </div>
            <div>
              <label
                for="openingHour"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Opening Hour
                <input
                  type="time"
                  name="openingHour"
                  value={formData.openingHour}
                  onChange={handleInputChange}
                  className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  defaultValue="00:00"
                ></input>
              </label>
            </div>
            <div>
              <label
                for="closingHour"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Closing Hour
                <input
                  type="time"
                  name="closingHour"
                  value={formData.closingHour}
                  onChange={handleInputChange}
                  className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  defaultValue="23:59"
                ></input>
              </label>
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Spot Location
              </label>
              <input
                type="text"
                name="spotLocation"
                value={formData.spotLocation}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              {errors.spotLocation && (
                <span className="bg-red-500">{errors.spotLocation}</span>
              )}
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Spot category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select a spot category</option>
                  <option key="Popular Spots" value="Popular Spots">
                    Popular Spots
                  </option>
                  <option key="Activities" value="Activities">
                    Activities
                  </option>
                  <option key="Sites and Attractions" value="Sites and Attractions">
                  Sites and Attractions
                  </option>                    
              </select>
              {errors.spotLocation && (
                <span className="bg-red-500">{errors.spotLocation}</span>
              )}
            </div>
            <div className="w-full">
              <label
                for="spotLimit"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Spot Capacity
              </label>
              <input
                type="number"
                name="spotLimit"
                value={formData.spotLimit}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                defaultValue={99999999}
              />
              {errors.spotLimit && (
                <span className="bg-red-500">{errors.spotLimit}</span>
              )}
            </div>
            <div>
              <ImageUploadComponent
                onFileChange={handleFileChange}
                errors={errors.spotImageUrl}
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
                <strong className="font-semibold">Admission:</strong>
                  {" "}
                  ${summary.spotAdmission}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Discounted Price:</strong>
                    {" "}
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
