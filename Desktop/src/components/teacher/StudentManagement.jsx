import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Users,
  User,
  LogOut,
  CalendarDays,
  ArrowLeft,
  Upload,
  Edit,
  Search,
  Menu as MenuIcon,
  Sun,
  Moon,
  Home,
  QrCode,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import fullLogo from "../../assets/tracked-logo.png";
import iconLogo from "../../assets/tracked-icon.png";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeStudent, setGradeStudent] = useState(null);
  const [selectedGradeType, setSelectedGradeType] = useState("prelim");
  const [gradeValue, setGradeValue] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);

  const qrCodeData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQAAAADAX2ykAAACaklEQVR4nO2aTW7bMBCFv6kEeEnfiL5Zz5QbKEfpAQqQywISXhckbdr9SYMqqlkMF4oVfYsBBm9mHkkT71mvn96Fg/POO++88847/yve6pqBPGN23gzYDHL7djkwHud35qMkKYFdAC15xi75JLswSZJ0z390PM7vxM/1bz5DfAHBihG+ziLXbwbTelA8zu/Lzw/vJZfxZcZg4pbkg+Jx/mN5LWFFS5C0sLWu++/icf7v+KbfICCDEbaZuGyzosAA+i2QZ4vf+T/iX83M7AzELydBPskueQbYyvh8bDzO78QX/d4UqtczJvJmghXdq/f54nf+jdWZn5gAwoqkFQhSa8dr4bQ8W/zO/37dzc+lCZ9kMAmylXJtMW1YXI6Ix/l9+abLsCIlkNIkLeXbJAgqD9fvkHytz1Hr9ZcEYa17Wkuolbq+Plv8zr+xav8thhe0MImYoIo4SEXTrt8R+a4+F9Vea3GZtBYoSnb9DsnT5VKJOkSXcp2qkttM7fkdj++6rqTbkEWvWrl+R+VbftvUXJOsWpqr/8X776D8Nb81l3V+ZtJdkZ5cv2PynT8qSX7wv/EqZ9fviPyj/9Vy29BI0Kyv53dQvq/PXS1OzQnfltfnEfnr+ZGo/re9WtRmxAWMkLBj4nF+X74/P6obzmv1v2XcSpPc/47L3/nfNKn3v21q9v47Lt/135bQm/+dOmF7fv8TPp9kZifZ5+6Q/5vfbx+Tf7wfC4BeL5uJfEZkK5iOicf5ffnH/tsO9NslndgeXp+H5H8yP7d2XLpuantant8R+R/uT9bH9T+hN8bPF7/zzjvvvPPOj8h/B1eMSol08+B/AAAAAElFTkSuQmCC";
  // Sample data with initial null grades
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      studentId: "2021-0001",
      grades: { midterm: null, final: null },
      attendance: [
        { date: "2024-01-10", status: "present" },
        { date: "2024-01-12", status: "present" },
        { date: "2024-01-15", status: "absent" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "2021-0002",
      grades: { midterm: null, final: null },
      attendance: [
        { date: "2024-01-10", status: "present" },
        { date: "2024-01-12", status: "absent" },
        { date: "2024-01-15", status: "present" },
      ],
    },
  ]);

  useEffect(() => {
    // Check localStorage for theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery)
  );

  const handleOpenGradeModal = (student) => {
    setGradeStudent(student);
    setShowGradeModal(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  const handleUpdateGrade = () => {
    const updatedStudents = students.map((student) => {
      if (student.id === gradeStudent.id) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [selectedGradeType]: Number(gradeValue),
          },
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    setShowGradeModal(false);
    setGradeStudent(null);
  };

  const renderGrades = (grades) => {
    if (grades) {
      return (
        <>
          {Object.entries(grades).map(([term, grade]) => (
            <div
              key={term}
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="text-sm text-gray-500 capitalize">{term}</div>
              <div className="text-xl font-semibold">
                {grade !== null ? grade : "-"}
              </div>
            </div>
          ))}
        </>
      );
    }
    return null;
  };

  const renderAttendanceTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Student ID</th>
            <th className="py-3 text-left">Name</th>
            {["2024-01-10", "2024-01-12", "2024-01-15"].map((date) => (
              <th key={date} className="py-3 text-center">
                {new Date(date).toLocaleDateString()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50">
              <td className="py-3">{student.studentId}</td>
              <td className="py-3">{student.name}</td>
              {student.attendance.map((record, index) => (
                <td key={index} className="py-3 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const exportToExcel = () => {
    const exportData = students.map((student) => ({
      StudentID: student.studentId,
      Name: student.name,
      Midterm: student.grades.midterm !== null ? student.grades.midterm : "N/A",
      Final: student.grades.final !== null ? student.grades.final : "N/A",
      Attendance: student.attendance
        .map((a) => `${a.date} (${a.status})`)
        .join(", "),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Data");

    XLSX.writeFile(wb, "StudentData.xlsx");
  };

  const renderContent = () => {
    if (selectedStudent) {
      return (
        <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="hover:bg-gray-100 p-2 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <span>{selectedStudent.name}</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Student Information</h3>
                <p>Student ID: {selectedStudent.studentId}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Grades</h3>
                <div className="grid grid-cols-3 gap-4">
                  {renderGrades(selectedStudent.grades)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Attendance History</h3>
                <div className="space-y-2">
                  {selectedStudent.attendance.map((record, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span
                        className={`capitalize ${
                          record.status === "present"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {activeTab === "students"
                  ? "Students List"
                  : "Attendance Record"}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className={`pl-10 pr-4 py-2 border rounded-lg ${
                      darkMode ? "bg-gray-700 text-white" : ""
                    }`}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {activeTab === "students" && (
                  <button
                    onClick={() => setShowGradeModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg custom-maroon-button"
                  >
                    <Upload size={16} />
                    <span>Upload Grades</span>
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "students" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Name</th>
                      <th className="py-3 text-left">Student ID</th>
                      <th className="py-3 text-center">Midterm</th>
                      <th className="py-3 text-center">Final</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`border-b group hover:${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <td className="py-3">{student.name}</td>
                        <td className="py-3">{student.studentId}</td>
                        <td className="py-3 text-center">
                          {student.grades.midterm !== null
                            ? student.grades.midterm
                            : "-"}
                        </td>
                        <td className="py-3 text-center">
                          {student.grades.final !== null
                            ? student.grades.final
                            : "-"}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-red-500 hover:text-red-700"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              renderAttendanceTable()
            )}
          </CardContent>
        </Card>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg custom-maroon-button"
          >
            <QrCode size={16} />
            <span>Generate QR</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg custom-maroon-button"
          >
            <Upload size={16} />
            <span>Export</span>
          </button>
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
                             darkMode
                               ? "hover:bg-gray-700"
                               : "hover:bg-gray-100"
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
            onClick={() => navigate("/home")}
            className={`w-full p-4 flex items-center 
                ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }
              `}
          >
            <Home size={20} className="mr-3" />
            {!collapsed && <span>Home</span>}
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`w-full p-4 flex items-center 
                ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }
                ${
                  activeTab === "students"
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                    : ""
                }
              `}
          >
            <Users size={20} className="mr-3" />
            {!collapsed && <span>Students</span>}
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`w-full p-4 flex items-center 
                ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }
                ${
                  activeTab === "attendance"
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                    : ""
                }
              `}
          >
            <CalendarDays size={20} className="mr-3" />
            {!collapsed && <span>Attendance</span>}
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

      {/* Grade Update Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-lg w-96 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Upload Student Grade</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Student
                </label>
                <select
                  value={gradeStudent ? gradeStudent.id : ""}
                  onChange={(e) => {
                    const selected = students.find(
                      (s) => s.id === parseInt(e.target.value)
                    );
                    setGradeStudent(selected);
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  <option value="" disabled>
                    Select a student
                  </option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Grade Type
                </label>
                <select
                  value={selectedGradeType}
                  onChange={(e) => setSelectedGradeType(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grade</label>
                <select
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">Select a grade</option>
                  <option value="1.00">1.00</option>
                  <option value="1.25">1.25</option>
                  <option value="1.50">1.50</option>
                  <option value="1.75">1.75</option>
                  <option value="2.00">2.00</option>
                  <option value="2.25">2.25</option>
                  <option value="2.50">2.50</option>
                  <option value="2.75">2.75</option>
                  <option value="3.00">3.00</option>
                  <option value="4.00">4.00</option>
                  <option value="5.00">5.00</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowGradeModal(false)}
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode
                      ? "hover:bg-gray-700 border-gray-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGrade}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Upload Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Attendance QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <img
                src={qrCodeData}
                alt="Attendance QR Code"
                className="w-48 h-48"
              />
            </div>

            <p className="text-center text-sm text-gray-500 mb-4">
              Scan this QR code to mark attendance for today's class
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
