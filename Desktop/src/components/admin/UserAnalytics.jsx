import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Download } from 'lucide-react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const UserAnalytics = ({ darkMode }) => {
  // Sample monthly data (you can replace this with real data)
  const monthlyData = [
    { month: 'Jan', teachers: 45, students: 480, sections: 18, courses: 28 },
    { month: 'Feb', teachers: 47, students: 485, sections: 19, courses: 29 },
    { month: 'Mar', teachers: 48, students: 490, sections: 19, courses: 29 },
    { month: 'Apr', teachers: 50, students: 500, sections: 20, courses: 30 }
  ];

  const currentData = [
    { name: 'Teachers', value: 50, color: '#4ade80' },
    { name: 'Students', value: 500, color: '#60a5fa' },
    { name: 'Sections', value: 20, color: '#f472b6' },
    { name: 'Courses', value: 30, color: '#facc15' }
  ];

  const handleExport = () => {
    const csvContent = [
      ['Month', 'Teachers', 'Students', 'Sections', 'Courses'],
      ...monthlyData.map(item => [
        item.month,
        item.teachers,
        item.students,
        item.sections,
        item.courses
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? "bg-gray-800 text-white" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>User Analytics Overview</CardTitle>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
              ${darkMode 
                ? "bg-gray-700 hover:bg-gray-600 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            <Download size={16} />
            Export Data
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth */}
            <div className="h-[300px] w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Monthly Growth</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "0.5rem",
                      color: darkMode ? "#ffffff" : "#000000"
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="teachers" stroke="#4ade80" />
                  <Line type="monotone" dataKey="students" stroke="#60a5fa" />
                  <Line type="monotone" dataKey="sections" stroke="#f472b6" />
                  <Line type="monotone" dataKey="courses" stroke="#facc15" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Current Distribution */}
            <div className="h-[300px] w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Current Distribution</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "0.5rem",
                      color: darkMode ? "#ffffff" : "#000000"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Bar Chart */}
            <div className="h-[300px] w-full lg:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Monthly Comparison</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "0.5rem",
                      color: darkMode ? "#ffffff" : "#000000"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="teachers" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="students" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sections" fill="#f472b6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="courses" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;