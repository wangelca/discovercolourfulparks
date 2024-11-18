import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsAdmin() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState("Most Recent");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/reports/")
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
        setFilteredReports(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Default sort by most recent
      })
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  useEffect(() => {
    let updatedReports = [...reports];
    if (filter === "Most Recent") {
      updatedReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filter === "Oldest") {
      updatedReports.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    setFilteredReports(updatedReports);
  }, [filter, reports]);

  const handleDelete = async (reportID) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await fetch(`http://localhost:8000/reports/${reportID}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setReports(reports.filter((report) => report.reportID !== reportID));
          alert("Report deleted successfully.");
        } else {
          const errorData = await response.json();
          console.error("Failed to delete the report:", errorData.detail);
          alert(`Failed to delete the report: ${errorData.detail}`);
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        alert("An error occurred while deleting the report. Please try again.");
      }
    }
  };
   

  const handleResolve = (reportID) => {
    const comment = prompt("Please enter a comment for resolving this report:");
    if (comment) {
      fetch(`http://localhost:8000/reports/${reportID}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Report resolved successfully!");
          } else {
            console.error("Failed to resolve the report.");
          }
        })
        .catch((error) => console.error("Error resolving report:", error));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Reports Database</h1>
      </div>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-medium">Sort by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-2 px-4 border rounded-lg"
        >
          <option value="Most Recent">Most Recent</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white opacity-85 border text-black text-sm font-medium border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-white font-semibold text-medium">
              <th className="py-3 px-6">Report ID</th>
              <th className="py-3 px-6">Type</th>
              <th className="py-3 px-6">Details</th>
              <th className="py-3 px-6">Park ID</th>
              <th className="py-3 px-6">Created At</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.reportID} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{report.reportID}</td>
                  <td className="py-3 px-6">{report.reportType}</td>
                  <td className="py-3 px-6">{report.details}</td>
                  <td className="py-3 px-6">{report.parkId}</td>
                  <td className="py-3 px-6">{new Date(report.created_at).toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleResolve(report.reportID)}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDelete(report.reportID)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
