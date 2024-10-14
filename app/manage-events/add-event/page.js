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
    isRoutine: false,
    recurrenceType: "", // daily, weekly, or specificDays
    recurrenceEndDate: "", // for daily or weekly recurrence
    specificDays: [], // for specific days recurrence
  });

  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState(null);
  const [parks, setParks] = useState([]);
  const [eventList, setEventList] = useState([]); // Add this to your useState hook
  const router = useRouter();

  const handleSpecificDaysChange = (dates) => {
    setFormData({ ...formData, specificDays: dates });
  };

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
      newErrors.discount =
        "Discount must be between 0 and 9999, and less than fee";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.eventLocation)
      newErrors.eventLocation = "Location is required";
    if (formData.startDate > formData.endDate)
      newErrors.startDate = "Start date must be before end date";
    if (!formData.eventImageUrl)
      newErrors.eventImageUrl = "Event image is required";
    setErrors(newErrors);
    console.log("Validation errors:", newErrors); // Log the errors to see if any exist
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    let generatedEventList = [];

    // If routine event is selected
    if (formData.isRoutine) {
      if (formData.recurrenceType === "daily") {
        let currentStartDate = new Date(formData.startDate);
        let currentEndDate = new Date(formData.endDate);
        const recurrenceEndDate = new Date(formData.recurrenceEndDate);

        while (currentStartDate <= recurrenceEndDate) {
          generatedEventList.push({
            ...formData,
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate),
          });
          currentStartDate.setDate(currentStartDate.getDate() + 1); // Increment by one day
          currentEndDate.setDate(currentEndDate.getDate() + 1); // Increment the end date too
        }
      } else if (formData.recurrenceType === "weekly") {
        let currentStartDate = new Date(formData.startDate);
        let currentEndDate = new Date(formData.endDate);
        const recurrenceEndDate = new Date(formData.recurrenceEndDate);

        while (currentStartDate <= recurrenceEndDate) {
          generatedEventList.push({
            ...formData,
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate),
          });
          currentStartDate.setDate(currentStartDate.getDate() + 7); // Increment by one week
          currentEndDate.setDate(currentEndDate.getDate() + 7); // Increment the end date too
        }
      } else if (formData.recurrenceType === "specificDays") {
        formData.specificDays.forEach((date) => {
          generatedEventList.push({
            ...formData,
            startDate: new Date(date),
            endDate: new Date(date),
          });
        });
      }
    } else {
      // If it's not a recurring event, just add the single event
      generatedEventList.push(formData);
    }

    setEventList(generatedEventList); // Set the generated event list in state
    setSummary(formData); // Show the review page
  };

  const handleSubmit = async () => {
    let eventList = [];

    // If routine event is selected
    if (formData.isRoutine) {
      if (formData.recurrenceType === "daily") {
        let currentStartDate = new Date(formData.startDate);
        let currentEndDate = new Date(formData.endDate);
        const recurrenceEndDate = new Date(formData.recurrenceEndDate);

        while (currentStartDate <= recurrenceEndDate) {
          eventList.push({
            ...formData,
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate),
          });
          currentStartDate.setDate(currentStartDate.getDate() + 1); // Increment by one day
          currentEndDate.setDate(currentEndDate.getDate() + 1); // Increment the end date too
        }
      } else if (formData.recurrenceType === "weekly") {
        let currentStartDate = new Date(formData.startDate);
        let currentEndDate = new Date(formData.endDate);
        const recurrenceEndDate = new Date(formData.recurrenceEndDate);

        while (currentStartDate <= recurrenceEndDate) {
          eventList.push({
            ...formData,
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate),
          });
          currentStartDate.setDate(currentStartDate.getDate() + 7); // Increment by one week
          currentEndDate.setDate(currentEndDate.getDate() + 7); // Increment the end date too
        }
      } else if (formData.recurrenceType === "specificDays") {
        formData.specificDays.forEach((date) => {
          eventList.push({ ...formData, startDate: new Date(date) });
        });
      }
    } else {
      eventList.push(formData); // Non-routine event, just one event
    }

    // Submit all events to backend
    try {
      for (let event of eventList) {
        const formDataObj = new FormData();
        formDataObj.append("parkId", event.parkId);
        formDataObj.append("eventName", event.eventName);
        formDataObj.append("description", event.description);
        formDataObj.append("fee", event.fee);
        formDataObj.append("discount", event.discount);
        formDataObj.append("eventLocation", event.eventLocation);
        formDataObj.append(
          "startDate",
          event.startDate.toISOString().slice(0, 19)
        );
        formDataObj.append("endDate", event.endDate.toISOString().slice(0, 19));
        formDataObj.append("requiredbooking", event.requiredbooking);
        if (event.eventImageUrl) {
          formDataObj.append("eventImageUrl", event.eventImageUrl);
        }

        await axios.post("http://localhost:8000/events/add", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      router.push("/manage-events");
    } catch (error) {
      console.error("Failed to add events", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {!summary ? (
        <form className="max-w-lg mx-auto bg-white p-6 rounded-md bg-opacity-85">
          <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add an Event
          </h2>
          <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
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
              {errors.fee && <span className="text-red-500">{errors.fee}</span>}
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

            <div>
              <label className="inline-flex items-center mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isRoutine"
                  checked={formData.isRoutine}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Is this a routine event?
                </span>
              </label>
            </div>

            <div>
              {formData.isRoutine && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Recurrence Type
                  </label>
                  <select
                    name="recurrenceType"
                    value={formData.recurrenceType}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  >
                    <option value="">Select recurrence type</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="specificDays">Specific Days</option>
                  </select>

                  {/* Show additional fields based on recurrence type */}
                  {formData.recurrenceType === "daily" ||
                  formData.recurrenceType === "weekly" ? (
                    <div className="w-full mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        End Date
                      </label>
                      <DatePicker
                        selected={formData.recurrenceEndDate}
                        onChange={(date) =>
                          handleDateChange(date, "recurrenceEndDate")
                        }
                        dateFormat="yyyy-MM-dd"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      />
                    </div>
                  ) : null}

                  {formData.recurrenceType === "specificDays" ? (
                    <div className="w-full mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select Specific Days
                      </label>
                      <DatePicker
                        selected={formData.specificDays}
                        onChange={(date) => handleSpecificDaysChange(date)}
                        dateFormat="yyyy-MM-dd"
                        multiple
                        inline
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      />
                    </div>
                  ) : null}
                </div>
              )}
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
          <h1 className="text-xl font-bold mb-4">Events Summary</h1>
          {/* Display event details once */}
          <p>
            {formData.eventImageUrl && (
              <img
                src={URL.createObjectURL(formData.eventImageUrl)}
                alt="Event"
                className="w-full h-64 object-cover mt-4"
              />
            )}
          </p>
          <p>
            <strong>Event Name:</strong> {formData.eventName}
          </p>
          <p>
            <strong>Description:</strong> {formData.description}
          </p>
          <p>
            <strong>Location:</strong> {formData.eventLocation}
          </p>
          <p>
            <strong>Fee:</strong> {formData.fee}
          </p>
          <p>
            <strong>Discount:</strong> {formData.discount}
          </p>
          <p>
            <strong>Required Booking:</strong>{" "}
            {formData.requiredbooking ? "Yes" : "No"}
          </p>

          {/* Display start and end dates separately */}
          <h3>Event Dates:</h3>
          {eventList.map((event, index) => (
            <div key={index}>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <hr />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="btn bg-green-500 text-white px-6 py-2 mt-4"
          >
            Confirm All Events
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEventPage;
