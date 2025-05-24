import React from 'react';
import { Users } from 'lucide-react';

const VolunteerCard = ({ label, count, iconColor, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-indigo-900">{label}</h3>
            <div className={`p-2 rounded-lg ${iconColor.bg}`}>
                <Users className={`w-5 h-5 ${iconColor.text}`} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-indigo-900">{count.toLocaleString()}</span>
            {trend && (
                <div className={`flex items-center text-sm ${
                    trend > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    </div>
);

export const Volunteers = () => {
    const stats = [
        {
            id: 1,
            label: "Active Volunteers",
            count: 856,
            iconColor: {
                bg: "bg-blue-100",
                text: "text-blue-600"
            },
            trend: 12
        },
        {
            id: 2,
            label: "Teams Deployed",
            count: 42,
            iconColor: {
                bg: "bg-green-100",
                text: "text-green-600"
            },
            trend: -5
        },
        {
            id: 3,
            label: "Available Volunteers",
            count: 234,
            iconColor: {
                bg: "bg-purple-100",
                text: "text-purple-600"
            },
            trend: 8
        }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">Volunteer Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <VolunteerCard
                        key={stat.id}
                        label={stat.label}
                        count={stat.count}
                        iconColor={stat.iconColor}
                        trend={stat.trend}
                    />
                ))}
            </div>
        </div>
    );
};

export default Volunteers;