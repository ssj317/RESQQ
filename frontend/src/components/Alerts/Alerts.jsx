import { AlertTriangle } from 'lucide-react';
import React from 'react';

export const Alerts = () => {
  const alerts = [
    {
      id: 1,
      type: "Flood Warning",
      description: "Chennai, Tamil Nadu - Severe flooding expected in low-lying areas",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
    },
    {
      id: 2,
      type: "Storm Alert",
      description: "Mumbai, Maharashtra - Heavy rainfall predicted",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Alert Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${alert.bgColor} ${alert.borderColor}`}
            >
              <div className="flex items-center">
                <AlertTriangle className={`w-6 h-6 mr-2 ${alert.iconColor}`} />
                <h3 className="font-semibold">{alert.type}</h3>
              </div>
              <p className="text-gray-600 mt-2">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
