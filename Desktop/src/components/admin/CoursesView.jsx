import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import DataTable from "./DataTable";
import FilterComponent from "./FilterComponent";
import EditModal from "./EditModal";

const baseURL = "http://127.0.0.1:8000"; // Replace with your base API URL

const CoursesView = ({ darkMode, onBack }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch courses from the backend API
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${baseURL}/admin/get_all_course`);
        const rawData = await response.text(); // Get raw text
        console.log(rawData); // Log the raw response

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        try {
          const data = JSON.parse(rawData); // Parse it manually
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        } catch (err) {
          throw new Error("Invalid JSON response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch programs from the backend API
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${baseURL}/admin/get_all_program`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch programs.");
        }

        setPrograms(data.programs); // Set programs data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
    fetchPrograms();
  }, []);

  // Filter courses whenever searchTerm or filterProgram changes
  useEffect(() => {
    const newFilteredCourses = courses.filter((course) => {
      const matchesSearch = Object.values(course)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesProgram =
        !filterProgram || course.program_name === filterProgram;
      return matchesSearch && matchesProgram;
    });

    setFilteredCourses(newFilteredCourses);
  }, [searchTerm, filterProgram, courses]);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedCourse) => {
    try {
      const response = await fetch(
        `${baseURL}/admin/course/${updatedCourse.course_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCourse),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course.");
      }

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_id === updatedCourse.course_id ? updatedCourse : course
        )
      );
      setFilteredCourses((prevFilteredCourses) =>
        prevFilteredCourses.map((course) =>
          course.course_id === updatedCourse.course_id ? updatedCourse : course
        )
      );
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (course) => {
    if (
      window.confirm(`Are you sure you want to delete ${course.course_name}?`)
    ) {
      try {
        // Send DELETE request to backend API
        const response = await fetch(
          `${baseURL}/admin/course/${course.course_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete course.");
        }

        // Update local state after successful deletion
        setCourses((prevCourses) =>
          prevCourses.filter((c) => c.course_id !== course.course_id)
        );
        setFilteredCourses((prevFilteredCourses) =>
          prevFilteredCourses.filter((c) => c.course_id !== course.course_id)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className={`${darkMode ? "bg-gray-800 text-white" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <CardTitle>Courses List</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <FilterComponent
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              key: "program",
              placeholder: "All Programs",
              value: filterProgram,
              options: [
                ...new Set(courses.map((c) => c.program_name).filter(Boolean)),
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "program") setFilterProgram(value);
          }}
        />

        <DataTable
          columns={[
            { header: "Course Code", key: "course_code" },
            { header: "Course Name", key: "course_name" },
            { header: "Program", key: "program_name" },
            { header: "Units", key: "units" },
            { header: "Description", key: "course_detail" },
          ]}
          data={filteredCourses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />

        {selectedCourse && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCourse(null);
            }}
            onSave={handleSave}
            data={selectedCourse}
            programs={programs} // Pass programs to the EditModal
            fields={[
              { key: "course_code", label: "Course Code", type: "text" },
              { key: "course_name", label: "Course Name", type: "text" },
              {
                key: "program_id",
                label: "Program",
                type: "select",
                options: programs.map((program) => ({
                  value: program.program_id,
                  label: program.program_name,
                })),
              },
              { key: "units", label: "Units", type: "number" },
              { key: "course_detail", label: "Description", type: "textarea" },
            ]}
            title="Edit Course"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesView;
