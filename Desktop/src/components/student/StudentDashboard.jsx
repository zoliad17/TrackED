import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Menu as MenuIcon,
  Home,
  Calendar,
  Book,
  Bell,
  Sun,
  Moon,
  BookOpen,
  LineChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import fullLogo from "../../assets/tracked-logo.png";
import iconLogo from "../../assets/tracked-icon.png";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Sample student data
  const studentSubjects = [
    {
      name: "Technopreneurship",
      code: "TechnoPre",
      schedule: "MWF 9:00-10:30 AM",
      instructor: "Ms. Lopez",
      room: "Room 301",
      attendance: {
        present: 24,
        late: 3,
        absent: 1,
        total: 28,
      },
      grades: {
        midterm: null,
        finals: null,
      },
    },
    {
      name: "Ethics",
      code: "GE108",
      schedule: "TTH 1:00-2:30 PM",
      instructor: "Dr. Ople",
      room: "Room 205",
      attendance: {
        present: 26,
        late: 2,
        absent: 0,
        total: 28,
      },
      grades: {
        midterm: null,
        finals: null,
      },
    },
    {
      name: "Project Management",
      code: "ITElectv3",
      schedule: "MWF 2:00-3:30 PM",
      instructor: "Ms. Libunao",
      room: "Room 405",
      attendance: {
        present: 25,
        late: 2,
        absent: 1,
        total: 28,
      },
      grades: {
        midterm: null,
        finals: null,
      },
    },
  ];

  // Weekly schedule
  const weeklySchedule = {
    Monday: [
      { subject: "Technopreneurship", time: "9:00-10:30 AM", room: "Room 301" },
      { subject: "Project Management", time: "2:00-3:30 PM", room: "Room 405" },
    ],
    Tuesday: [{ subject: "Ethics", time: "1:00-2:30 PM", room: "Room 205" }],
    Wednesday: [
      { subject: "Technopreneurship", time: "9:00-10:30 AM", room: "Room 301" },
      { subject: "Project Management", time: "2:00-3:30 PM", room: "Room 405" },
    ],
    Thursday: [{ subject: "Ethics", time: "1:00-2:30 PM", room: "Room 205" }],
    Friday: [
      { subject: "Technopreneurship", time: "9:00-10:30 AM", room: "Room 301" },
      { subject: "Project Management", time: "2:00-3:30 PM", room: "Room 405" },
    ],
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear authentication state from localStorage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");

      // Navigate to the login page
      navigate("/");
    }
  };

  const renderSubjectDetails = () => {
    if (!selectedSubject) return null;

    const attendancePercentage =
      (selectedSubject.attendance.present / selectedSubject.attendance.total) *
      100;

    return (
      <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedSubject.name}</span>
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Back to Dashboard
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Card */}
            <Card className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Attendance Rate:</span>
                    <span className="font-bold">
                      {attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded bg-green-100 dark:bg-green-900">
                      <div className="font-bold">
                        {selectedSubject.attendance.present}
                      </div>
                      <div className="text-sm">Present</div>
                    </div>
                    <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-900">
                      <div className="font-bold">
                        {selectedSubject.attendance.late}
                      </div>
                      <div className="text-sm">Late</div>
                    </div>
                    <div className="p-2 rounded bg-red-100 dark:bg-red-900">
                      <div className="font-bold">
                        {selectedSubject.attendance.absent}
                      </div>
                      <div className="text-sm">Absent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grades Card */}
            <Card className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <CardHeader>
                <CardTitle className="text-lg">Grade Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Midterm:</span>
                      <span>{selectedSubject.grades.midterm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Finals:</span>
                      <span>{selectedSubject.grades.finals}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (selectedSubject) {
      return renderSubjectDetails();
    }

    if (activeTab === "calendar") {
      return (
        <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(weeklySchedule).map(([day, schedules]) => (
                <div key={day} className="space-y-2">
                  <h3 className="font-semibold text-lg">{day}</h3>
                  <div className="space-y-2">
                    {schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{schedule.subject}</div>
                        <div className="text-sm opacity-75">
                          {schedule.time} | {schedule.room}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
    const colors = [
      "bg-blue-100 dark:bg-blue-900",
      "bg-green-100 dark:bg-green-900",
      "bg-purple-100 dark:bg-purple-900",
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentSubjects.map((subject, index) => (
            <Card
              key={subject.code}
              className={`${
                colors[index % colors.length]
              } text-black dark:text-white cursor-pointer transform transition hover:scale-105`}
              onClick={() => setSelectedSubject(subject)}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>{subject.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm opacity-75">
                    Instructor: {subject.instructor}
                  </p>
                  <p className="text-sm opacity-75">
                    Schedule: {subject.schedule}
                  </p>
                  <p className="text-sm opacity-75">Room: {subject.room}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attendance:</span>
                    <span className="font-bold">
                      {(
                        (subject.attendance.present /
                          subject.attendance.total) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${collapsed ? "w-20" : "w-64"} 
        ${darkMode ? "bg-gray-800" : "bg-white"} 
        transition-all duration-300 shadow-lg z-50`}
      >
        {/* Sidebar Header */}
        <div className="relative h-16 flex items-center justify-center">
          {collapsed ? (
            // Collapsed state: Icon acts as toggle button
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-2 rounded-lg transition-transform hover:scale-110 
                        ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
            >
              <img src={iconLogo} alt="Expand Sidebar" className="w-8 h-8" />
            </button>
          ) : (
            // Expanded state: Full logo with menu button
            <>
              <div className="flex items-center justify-center">
                <img
                  src={fullLogo}
                  alt="TrackEd Logo"
                  className="h-14 max-w-[200px] object-contain"
                />
              </div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={`absolute right-3 p-2 rounded-lg 
                          ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
              >
                <MenuIcon size={20} />
              </button>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedSubject(null);
            }}
            className={`w-full p-4 flex items-center 
              ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }
              ${
                activeTab === "home"
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : ""
              }`}
          >
            <Home size={20} className="mr-3" />
            {!collapsed && <span>Home</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("calendar");
              setSelectedSubject(null);
            }}
            className={`w-full p-4 flex items-center 
              ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }
              ${
                activeTab === "calendar"
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : ""
              }`}
          >
            <Calendar size={20} className="mr-3" />
            {!collapsed && <span>Schedule</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`${
          collapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        {/* Top Navigation */}
        <div
          className={`h-16 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm flex items-center justify-end px-6`}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <User size={20} />
              </button>

              {showUserMenu && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg 
                  ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } ring-1 ring-black ring-opacity-5`}
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-2 flex items-center space-x-2 
                      ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
