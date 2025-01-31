import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import DataTable from "./DataTable";
import FilterComponent from "./FilterComponent";
import EditModal from "./EditModal";

const baseURL = "http://127.0.0.1:8000";

const StudentsView = ({ darkMode, onBack }) => {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
    fetchSections();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/get_all_student`);
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/get_all_program`);
      if (!response.ok) throw new Error("Failed to fetch programs");
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/get_all_section`);
      if (!response.ok) throw new Error("Failed to fetch sections");
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const editFields = [
    {
      key: "firstname",
      label: "First Name",
      type: "text",
    },
    {
      key: "lastname",
      label: "Last Name",
      type: "text",
    },
    {
      key: "program_id",
      label: "Program",
      type: "select",
      options: programs.map((program) => ({
        value: program.program_id,
        label: program.program_name,
      })),
    },
    {
      key: "year_level",
      label: "Year Level",
      type: "select",
      options: [
        { value: 1, label: "1st Year" },
        { value: 2, label: "2nd Year" },
        { value: 3, label: "3rd Year" },
        { value: 4, label: "4th Year" },
      ],
    },
    {
      key: "section_id",
      label: "Section",
      type: "select",
      options: sections.map((section) => ({
        value: section.section_id,
        label: section.section_name,
      })),
    },
    {
      key: "email",
      label: "Email",
      type: "email",
    },
    {
      key: "current_gpa",
      label: "Current Grade",
      type: "number",
      min: 0,
      max: 100,
      step: 0.01,
    },
  ];

  const handleEdit = (student) => {
    const fullName =
      student.name || `${student.firstname || ""} ${student.lastname || ""}`;
    const [firstname, ...lastnameParts] = fullName.split(" ");
    const lastname = lastnameParts.join(" ");

    setSelectedStudent({
      ...student,
      firstname,
      lastname,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedStudent) => {
    try {
      console.log("Saving student:", updatedStudent); // Log updated student data to check

      const name = `${updatedStudent.firstname} ${updatedStudent.lastname}`;

      const response = await fetch(
        `${baseURL}/admin/update_student/${updatedStudent.student_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updatedStudent,
            name, // Combine the first and last name into one field
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update student");

      fetchStudents(); // Fetch updated students list
      setIsEditModalOpen(false); // Close modal after save
      setSelectedStudent(null); // Reset the selected student
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await fetch(
          `${baseURL}/admin/delete_student/${student.student_id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Failed to delete student");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProgram = !filterProgram || student.program === filterProgram;
    const matchesYear =
      !filterYear || student.year_level === parseInt(filterYear);
    return matchesSearch && matchesProgram && matchesYear;
  });

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
          <CardTitle>Students List</CardTitle>
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
              options: [...new Set(students.map((s) => s.program))],
            },
            {
              key: "yearLevel",
              placeholder: "All Years",
              value: filterYear,
              options: ["1", "2", "3", "4"],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "program") setFilterProgram(value);
            if (key === "yearLevel") setFilterYear(value);
          }}
        />
        <DataTable
          columns={[
            { header: "Student ID", key: "student_id" },
            { header: "Name", key: "name" },
            { header: "Program", key: "program" },
            { header: "Year Level", key: "year_level" },
            { header: "Section", key: "section" },
            { header: "Email", key: "email" },
            { header: "Current Grade", key: "current_gpa" },
          ]}
          data={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
        {selectedStudent && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedStudent(null);
            }}
            onSave={handleSave}
            data={selectedStudent}
            fields={editFields}
            title="Edit Student"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StudentsView;
