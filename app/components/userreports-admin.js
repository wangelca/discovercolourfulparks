import React, { useState, useEffect } from "react";
import { 
  FaFileAlt, 
  FaTag, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTrash, 
  FaFilter 
} from 'react-icons/fa';

export default function ReportsAdmin() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState("Most Recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/reports/")
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
        setFilteredReports(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
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
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await fetch(`http://localhost:8000/reports/${reportID}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setReports(reports.filter((report) => report.reportID !== reportID));
          window.alert("Report deleted successfully.");
        } else {
          const errorData = await response.json();
          console.error("Failed to delete the report:", errorData.detail);
          window.alert(`Failed to delete the report: ${errorData.detail}`);
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        window.alert("An error occurred while deleting the report. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gray-700 px-6 py-4">
            <div className="h-10 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-6">
            {[1,2,3,4,5].map(row => (
              <div key={row} className="mb-4 flex items-center">
                <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <svg 
            className="mx-auto h-24 w-24 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-600">No Reports Found</h2>
          <p className="mt-2 text-gray-500">There are currently no reports in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">User Reports Database</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Total Reports: {reports.length}</span>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-600" />
            <label htmlFor="filter" className="font-medium text-gray-700">Sort by:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="Most Recent">Most Recent</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  {[
                    { label: 'Report ID', icon: FaFileAlt },
                    { label: 'Type', icon: FaTag },
                    { label: 'Details', icon: FaFileAlt },
                    { label: 'Park ID', icon: FaMapMarkerAlt },
                    { label: 'Created At', icon: FaClock },
                    { label: 'Actions', icon: FaTrash }
                  ].map(({ label, icon: Icon }, index) => (
                    <th 
                      key={index} 
                      className="p-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="text-gray-500" />
                        <span>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr 
                    key={report.reportID} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-sm text-gray-700">{report.reportID}</td>
                    <td className="p-3 text-sm text-gray-700">{report.reportType}</td>
                    <td className="p-3 text-sm text-gray-700">{report.details}</td>
                    <td className="p-3 text-sm text-gray-700 ">{report.parkId}</td>
                    <td className="p-3 text-sm text-gray-700">{new Date(report.created_at).toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <button
                        onClick={() => handleDelete(report.reportID)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

