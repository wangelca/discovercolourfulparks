"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddSpotPage = () => {
  const [formData, setFormData] = useState({
    parkId: "",
    spotName: "",
    spotDescription: "",
    spotHourlyRate: "",
    spotDiscount: "",
    spotLocation: "",
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
    if (name === "spotHourlyRate" || name === "spotDiscount") {
      if (value < 0 || value > 9999) {
        setErrors({
          ...errors,
          [name]: `${
            name === "spotHourlyRate" ? "Hourly rate" : "Discount"
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedFormats.includes(file.type)) {
      setErrors({
        ...errors,
        spotImages: "Only JPEG and PNG formats are allowed",
      });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, spotImages: "File size should not exceed 10MB" });
      return;
    }

    // Validate image resolution
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          setErrors({
            ...errors,
            spotImages: "Image resolution should be at least 800x600 pixels",
          });
          return;
        }
        // If validation passes
        setFormData({ ...formData, spotImages: [file] });  // Array with one image
        setErrors({ ...errors, spotImages: null }); // Clear errors
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.parkId) newErrors.parkId = "Park ID is required";
    if (!formData.spotName) newErrors.spotName = "Spot name is required";
    if (!formData.spotDescription)
      newErrors.spotDescription = "Description is required";
    if (
      !formData.spotHourlyRate ||
      isNaN(formData.spotHourlyRate) ||
      formData.spotHourlyRate < 0 ||
      formData.spotHourlyRate > 9999
    ) {
      newErrors.spotHourlyRate = "Hourly rate must be between 0 and 9999";
    }
    if (
      !formData.spotDiscount ||
      isNaN(formData.spotDiscount) ||
      formData.spotDiscount < 0 ||
      formData.spotDiscount > 9999
    ) {
      newErrors.spotDiscount = "Discount must be between 0 and 9999";
    }
    if (!formData.spotLocation) newErrors.spotLocation = "Location is required";
    if (!formData.spotImages) newErrors.spotImages = "Spot image is required";
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
    formDataObj.append("parkId", formData.parkId);
    formDataObj.append("spotName", formData.spotName);
    formDataObj.append("spotDescription", formData.spotDescription);
    formDataObj.append("spotHourlyRate", formData.spotHourlyRate);
    formDataObj.append("spotDiscount", formData.spotDiscount);
    formDataObj.append("spotLocation", formData.spotLocation);
    formDataObj.append("requiredbooking", formData.requiredbooking);
    if (formData.spotImages && formData.spotImages.length === 1) {
      formDataObj.append("spotImageUrl", formData.spotImages[0]);  // Append one image
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
        <form className="max-w-lg mx-auto">
          <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a spot
          </h2>
          <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Spot Name
              </label>
              <input
                type="text"
                name="spotName"
                value={formData.spotName}
                onChange={handleInputChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type spot name"
              />
              {errors.spotName && (
                <span className="text-red-500">{errors.spotName}</span>
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
                <span className="text-red-500">{errors.spotDescription}</span>
              )}
            </div>

            <div class="w-full">
              <label
                for="hourlyRate"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Hourly Rate (in decimals)
              </label>
              <input
                type="number"
                name="spotHourlyRate"
                value={formData.spotHourlyRate}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="50"
              />
              {errors.spotHourlyRate && (
                <span className="text-red-500">{errors.spotHourlyRate}</span>
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
                name="spotDiscount"
                value={formData.spotDiscount}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0"
              />
              {errors.spotDiscount && (
                <span className="text-red-500">{errors.spotDiscount}</span>
              )}
            </div>

            <div class="w-full">
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
                <span className="text-red-500">{errors.spotLocation}</span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Spot Image
              </label>
              <input
                type="file"
                name="spotImage"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              {errors.spotImageUrl && (
                <span className="text-red-500">{errors.spotImageUrl}</span>
              )}
            </div>

            <div>
              <label className="inline-flex items-center mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  name="requiredBooking"
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
                <strong className="font-semibold">Description:</strong>{" "}
                {summary.spotDescription}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Hourly Rate:</strong>
                <span className="text-green-600 font-bold">
                  {" "}
                  ${summary.spotHourlyRate}
                </span>
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Discount:</strong>
                <span className="text-red-600 font-bold">
                  {" "}
                  {summary.spotDiscount}%
                </span>
              </p>
              <p>
                Required Booking: {summary.requiredbooking ? "True" : "False"}
              </p>
            </div>
            {/* Google Maps Embed */}
            <div className="mt-6">
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: "12px" }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${summary.parameters}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>

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
}

export default AddSpotPage;