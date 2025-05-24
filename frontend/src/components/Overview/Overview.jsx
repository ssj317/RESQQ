// Overview.js
import React from 'react';
import { AlertTriangle, Box, Users, Phone, MapPin, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, secondaryColor }) => (
    <div className={`bg-gradient-to-br ${color} ${secondaryColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-white text-sm font-medium opacity-90 mb-1">{title}</p>
                <p className="text-white text-3xl font-bold">{value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
                <Icon className="w-8 h-8 text-white" />
            </div>
        </div>
    </div>
);

const AlertItem = ({ alert }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
        <div className="flex items-center space-x-4">
            <div className={`w-2 h-10 rounded-full ${
                alert.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <div>
                <p className="font-semibold text-indigo-900">{alert.type}</p>
                <div className="flex items-center text-sm text-indigo-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {alert.location}
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                alert.severity === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
                {alert.severity}
            </span>
            <div className="flex items-center text-xs text-indigo-400 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(alert.timestamp).toLocaleTimeString()}
            </div>
        </div>
    </div>
);

export const Overview = ({ mockData, renderChart }) => {
    const stats = [
        { 
            title: 'Active Alerts', 
            value: '24', 
            icon: AlertTriangle, 
            color: 'from-red-500', 
            secondaryColor: 'to-red-600' 
        },
        { 
            title: 'Available Resources', 
            value: '1,234', 
            icon: Box, 
            color: 'from-indigo-500', 
            secondaryColor: 'to-indigo-600' 
        },
        { 
            title: 'Active Volunteers', 
            value: '856', 
            icon: Users, 
            color: 'from-emerald-500', 
            secondaryColor: 'to-emerald-600' 
        },
        { 
            title: 'Help Requests', 
            value: '156', 
            icon: Phone, 
            color: 'from-violet-500', 
            secondaryColor: 'to-violet-600' 
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <h2 className="text-xl font-semibold text-indigo-900 mb-6">Resource Distribution</h2>
                    <div className="overflow-x-auto">
                        {renderChart && renderChart()}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <h2 className="text-xl font-semibold text-indigo-900 mb-6">Recent Alerts</h2>
                    <div className="divide-y divide-indigo-100">
                        {mockData?.alerts?.map(alert => (
                            <AlertItem key={alert.id} alert={alert} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;