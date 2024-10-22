import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faPlus } from "@fortawesome/free-solid-svg-icons"; // Import specific icons

const GenerateDescriptionComponent = ({
  entityName,
  parkName,
  entityType,
  onDescriptionGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateDescription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Continue with the description generation process
      const formData = new FormData();
      formData.append("parkName", parkName);
      formData.append("name", entityName);
      formData.append("entityType", entityType);

      const response = await axios.post(
        "http://localhost:8000/generate-description",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const generatedDescription = response.data.description;
      onDescriptionGenerated(generatedDescription);
    } catch (error) {
      console.error("Error:", error.response || error.message);
      setError("Failed to generate description.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button" // This prevents the form from submitting
        onClick={handleGenerateDescription}
        className="mt-1 bg-green-500 text-white font-bold text-sm py-2 px-4 rounded flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
        ) : (
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
        )}
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default GenerateDescriptionComponent;
