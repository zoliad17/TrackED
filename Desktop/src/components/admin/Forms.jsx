import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const baseURL = "http://127.0.0.1:8000";

// Add Teacher Form Component
const AddTeacherForm = ({ darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "teacher123", // Default password for teachers
    program: "",
  });

  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/get_all_program"
      );
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      setError("Failed to load programs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const teacherData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.email,
        password: formData.password,
        role: "teacher", // Role is predefined as 'teacher' for new teachers
        program_id: formData.program,
      };

      // Send POST request to create the teacher
      const response = await fetch(
        "http://127.0.0.1:8000/create/user/teacher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teacherData),
        }
      );

      const result = await response.json();
      if (response.status === 201) {
        alert(result.message || "Teacher added successfully!");
        onClose(); // Close the form after successful submission
      } else {
        setError(result.detail || "Failed to add teacher");
      }
    } catch (error) {
      setError("Failed to add teacher");
    }
  };

  return (
    <Card
      className={`${
        darkMode ? "bg-gray-800 text-white" : ""
      } max-w-2xl mx-auto`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Teacher</CardTitle>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <select
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.program}
              onChange={(e) =>
                setFormData({ ...formData, program: e.target.value })
              }
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_id}>
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg custom-maroon-button`}
            >
              Add Teacher
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Add Student Form Component

const AddStudentForm = ({ darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "student123",
    program: "",
    yearLevel: "",
    section: "",
  });

  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (formData.program) {
      fetchSections();
    }
  }, [formData.program]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/get_all_program"
      );
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      setError("Failed to load programs");
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/get_all_section"
      );
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
      setError("Failed to load sections");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.email,
        password: formData.password,
        role: "student", // Role is predefined as 'student' for new students
        program_id: formData.program,
        section_id: formData.section,
        year_level: formData.yearLevel,
      };

      // Send POST request to create the student
      const response = await fetch(
        "http://127.0.0.1:8000/create/user/student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      const result = await response.json();
      if (response.status === 201) {
        alert(result.message || "Student added successfully!");
        onClose(); // Close the form after successful submission
      } else {
        setError(result.detail || "Failed to add student");
      }
    } catch (error) {
      setError("Failed to add student");
    }
  };

  const handleProgramChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      program: e.target.value,
      section: "", // Reset section when program changes
    }));
  };

  return (
    <Card
      className={`${
        darkMode ? "bg-gray-800 text-white" : ""
      } max-w-2xl mx-auto`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Student</CardTitle>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.program}
                onChange={handleProgramChange}
                required
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year Level
              </label>
              <select
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.yearLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    yearLevel: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.section}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  section: e.target.value,
                }))
              }
              required
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.section_id} value={section.section_id}>
                  {section.section_name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg custom-maroon-button"
            >
              Add Student
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

//Add Section Form
const AddSectionForm = ({ darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    sectionName: "",
    programId: "",
    yearLevel: "",
    schedule: "",
    currentStudent: 0, // Updated field for current students
  });
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  // Fetch available programs when the form loads
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/get_all_program"
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch programs.");
        }

        setPrograms(data.programs);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs");
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    // Ensure currentStudent is a valid integer
    const currentStudentNum = parseInt(formData.currentStudent, 10);

    if (isNaN(currentStudentNum) || currentStudentNum < 0) {
      setError(
        "Current students must be a valid integer greater than or equal to 0"
      );
      return;
    }

    // Prepare the data to send
    const sectionData = {
      section_name: formData.sectionName,
      program_id: formData.programId,
      year_level: formData.yearLevel,
      schedule: formData.schedule,
      current_student: currentStudentNum,
    };

    try {
      // POST request to FastAPI backend
      const response = await fetch(
        "http://127.0.0.1:8000/admin/section/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.detail) {
          throw new Error(data.detail);
        }
        throw new Error("Failed to add section");
      }

      console.log("Section created successfully:", data);
      onClose(); // Close the form on success
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <Card
      className={`${
        darkMode ? "bg-gray-800 text-white" : ""
      } max-w-2xl mx-auto`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Section</CardTitle>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Section Name
            </label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.sectionName}
              onChange={(e) =>
                setFormData({ ...formData, sectionName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.programId}
                onChange={(e) =>
                  setFormData({ ...formData, programId: e.target.value })
                }
                required
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year Level
              </label>
              <select
                className={`w-full p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                value={formData.yearLevel}
                onChange={(e) =>
                  setFormData({ ...formData, yearLevel: e.target.value })
                }
                required
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Schedule</label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.schedule}
              onChange={(e) =>
                setFormData({ ...formData, schedule: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Students
            </label>
            <input
              type="number"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.currentStudent}
              onChange={(e) =>
                setFormData({ ...formData, currentStudent: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg custom-maroon-button"
            >
              Add Section
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

//Add Course Form
const AddCourseForm = ({ darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    program_id: "",
    units: "",
    course_detail: "",
    class_status: true, // Added this field with default value true
  });
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${baseURL}/admin/get_all_program`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch programs.");
        }

        setPrograms(data.programs);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs");
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate units is a valid number (now expect integer)
    const unitsNum = parseInt(formData.units, 10); // Parse as an integer

    // Check if units is a valid integer
    if (isNaN(unitsNum) || unitsNum <= 0) {
      setError("Units must be a valid integer greater than 0");
      return;
    }

    // Prepare the data to send
    const courseData = {
      ...formData,
      units: unitsNum, // Ensure it's an integer before sending
      class_status: true, // Ensure this is included
    };

    try {
      const response = await fetch(`${baseURL}/admin/create/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.detail) {
          if (Array.isArray(data.detail)) {
            const errorMessage = data.detail
              .map((err) => `${err.loc.join(".")} - ${err.msg}`)
              .join("\n");
            throw new Error(errorMessage);
          } else {
            throw new Error(JSON.stringify(data.detail, null, 2));
          }
        }
        throw new Error(data.detail || "Failed to add course");
      }

      console.log("Course added successfully:", data);
      onClose();
    } catch (err) {
      console.error("Full error:", err);
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <Card
      className={`${
        darkMode ? "bg-gray-800 text-white" : ""
      } max-w-2xl mx-auto`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Course</CardTitle>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Code
            </label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.course_code}
              onChange={(e) =>
                setFormData({ ...formData, course_code: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name
            </label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.course_name}
              onChange={(e) =>
                setFormData({ ...formData, course_name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Units</label>
            <input
              type="number"
              min="1" // Minimum value of 1
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.units}
              onChange={(e) =>
                setFormData({ ...formData, units: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <select
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.program_id}
              onChange={(e) =>
                setFormData({ ...formData, program_id: e.target.value })
              }
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_id}>
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Details
            </label>
            <textarea
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              value={formData.course_detail}
              onChange={(e) =>
                setFormData({ ...formData, course_detail: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg custom-maroon-button"
            >
              Add Course
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { AddTeacherForm, AddStudentForm, AddSectionForm, AddCourseForm };
