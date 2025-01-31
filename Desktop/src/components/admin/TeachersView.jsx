import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import DataTable from "./DataTable";
import FilterComponent from "./FilterComponent";
import EditModal from "./EditModal";

const baseURL = "http://127.0.0.1:8000";

const TeachersView = ({ darkMode, onBack }) => {
  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
    fetchPrograms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/get_all_teacher`);
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
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
      key: "email",
      label: "Email",
      type: "email",
    },
  ];

  const handleEdit = (teacher) => {
    const fullName =
      teacher.name || `${teacher.firstname || ""} ${teacher.lastname || ""}`;
    const [firstname, ...lastnameParts] = fullName.split(" ");
    const lastname = lastnameParts.join(" ");

    setSelectedTeacher({
      ...teacher,
      firstname,
      lastname,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedTeacher) => {
    try {
      const response = await fetch(
        `${baseURL}/admin/update_teacher/${parseInt(
          updatedTeacher.teacher_id
        )}`, // Ensure integer ID
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTeacher),
        }
      );
      if (!response.ok) throw new Error("Failed to update teacher");
      fetchTeachers();
      setIsEditModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      try {
        const response = await fetch(
          `${baseURL}/admin/delete_teacher/${teacher.teacher_id}`, // teacher_id as string
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Failed to delete teacher");
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = Object.values(teacher)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProgram = !filterProgram || teacher.program === filterProgram;
    return matchesSearch && matchesProgram;
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
          <CardTitle>Teachers List</CardTitle>
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
              options: programs.map((program) => program.program_name),
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "program") setFilterProgram(value);
          }}
        />
        <DataTable
          columns={[
            { header: "Teacher ID", key: "teacher_id" },
            { header: "Name", key: "name" },
            { header: "Program", key: "program" },
            { header: "Email", key: "email" },
          ]}
          data={filteredTeachers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
        {selectedTeacher && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTeacher(null);
            }}
            onSave={handleSave}
            data={selectedTeacher}
            fields={editFields}
            title="Edit Teacher"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TeachersView;
