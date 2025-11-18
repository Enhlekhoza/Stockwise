import React, { useState, useEffect } from 'react';

type Alert = {
  id: number;
  title: string;
  time: string;
  severity: 'High' | 'Medium' | 'Low';
  image: string;
};

const getSeverityClass = (severity: Alert['severity']) => {
  switch (severity) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-gray-100 text-gray-800';
  }
};

const AISecurityPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsPerPage] = useState(5); // You can adjust this value

  useEffect(() => {
    const fetchAlerts = () => {
      const queryParams = new URLSearchParams();
      if (filterSeverity !== 'All') {
        queryParams.append('severity', filterSeverity);
      }
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', alertsPerPage.toString());

      fetch(`http://localhost:3001/api/security/alerts?${queryParams.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAlerts(data);
        })
        .catch(console.error);
    };

    fetchAlerts(); // Fetch immediately on mount
    const interval = setInterval(fetchAlerts, 2000); // Fetch alerts every 2 seconds

    return () => clearInterval(interval);
  }, [filterSeverity, currentPage, alertsPerPage]); // Re-run effect when filterSeverity, currentPage, or alertsPerPage changes

  const handleConfirm = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/security/alerts/${id}/confirm`, {
        method: 'POST',
      });
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      setFeedbackMessage(`Alert ${id} confirmed.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000); // Hide after 3 seconds
      console.log(`Alert ${id} confirmed.`);
    } catch (error) {
      console.error(`Error confirming alert ${id}:`, error);
      setFeedbackMessage(`Error confirming alert ${id}.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  const handleDismiss = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/security/alerts/${id}/dismiss`, {
        method: 'POST',
      });
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      setFeedbackMessage(`Alert ${id} dismissed.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000); // Hide after 3 seconds
      console.log(`Alert ${id} dismissed.`);
    } catch (error) {
      console.error(`Error dismissing alert ${id}:`, error);
      setFeedbackMessage(`Error dismissing alert ${id}.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">StockWise AI Security Alerts</h2>
      {showFeedback && feedbackMessage && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          {feedbackMessage}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">All Events</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="severityFilter" className="text-gray-600 text-sm">Filter by Severity:</label>
            <select
              id="severityFilter"
              className="border rounded-md p-1 text-sm"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as 'All' | 'High' | 'Medium' | 'Low')}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedAlert(alert);
                  setShowDetailModal(true);
                }}
              >
                {/* Image from alert */}
                <div className="bg-black rounded flex items-center justify-center text-white aspect-video md:col-span-1 h-48">
                  <img src={alert.image} alt={alert.title} className="object-contain w-full h-full rounded" />
                </div>
                {/* Alert Details */}
                <div className="md:col-span-2 flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityClass(alert.severity)}`}>
                        {alert.severity} Severity
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center"
                      onClick={() => handleConfirm(alert.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-sm flex items-center"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No security alerts.</p>
          )}
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg font-semibold text-gray-700">Page {currentPage}</span>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showDetailModal && selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Alert Details</h3>
            <div className="mb-4">
              <img src={selectedAlert.image} alt={selectedAlert.title} className="w-full h-auto rounded mb-2" />
              <p className="font-bold text-gray-800">{selectedAlert.title}</p>
              <p className="text-sm text-gray-500">{selectedAlert.time}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityClass(selectedAlert.severity)}`}>
                {selectedAlert.severity} Severity
              </span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => {
                  handleConfirm(selectedAlert.id);
                  setShowDetailModal(false);
                }}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  handleDismiss(selectedAlert.id);
                  setShowDetailModal(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AISecurityPage;
