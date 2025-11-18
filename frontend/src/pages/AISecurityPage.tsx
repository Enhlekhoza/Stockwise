import React, { useState, useEffect } from 'react';
import { FiVideo, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';

type Alert = {
  id: number;
  title: string;
  time: string;
  severity: 'High' | 'Medium' | 'Low';
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

  useEffect(() => {
    fetch('http://localhost:3001/api/security/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Security Alerts</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">All Events</h3>
          {/* Filtering options could go here */}
        </div>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border rounded-lg p-4">
                {/* Video Placeholder */}
                <div className="bg-black rounded flex items-center justify-center text-white aspect-video md:col-span-1">
                  <FiVideo size={40} />
                </div>
                {/* Alert Details */}
                <div className="md:col-span-2 flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityClass(alert.severity)}`}>
                        <FiAlertTriangle className="inline mr-1 mb-0.5" />
                        {alert.severity} Severity
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center">
                      <FiCheckCircle className="mr-1" /> Confirm
                    </button>
                    <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-sm flex items-center">
                      <FiX className="mr-1" /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No security alerts.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AISecurityPage;
