import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import DataTable from "./DataTable";
import FilterComponent from "./FilterComponent";
import EditModal from "./EditModal";

const SectionsView = ({ darkMode, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sections, setSections] = useState([]); // Initial state as an empty array
  const [programs, setPrograms] = useState([]); // Store programs here
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  const editFields = [
    { key: "section_name", label: "Section Name", type: "text" },
    {
      key: "year_level",
      label: "Year Level",
      type: "select",
      options: [
        { value: "1", label: "1st Year" },
        { value: "2", label: "2nd Year" },
        { value: "3", label: "3rd Year" },
        { value: "4", label: "4th Year" },
      ],
    },
    {
      key: "program_id",
      label: "Program",
      type: "select",
      options: programs.map((program) => ({
        value: program.program_id,
        label: program.program_name, // Program name here
      })),
    },
    { key: "current_student", label: "Current Students", type: "number" },
    { key: "schedule", label: "Schedule", type: "text" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both sections and programs
        const [sectionsResponse, programsResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/admin/get_all_section"),
          fetch("http://127.0.0.1:8000/admin/get_all_program"),
        ]);

        if (!sectionsResponse.ok || !programsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const sectionsData = await sectionsResponse.json();
        const programsData = await programsResponse.json();

        setSections(sectionsData.sections); // Set sections
        setPrograms(programsData.programs); // Set programs
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    }

    fetchData();
  }, []);

  const handleEdit = (section) => {
    setSelectedSection(section);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedSection) => {
    // Ensure section has a valid ID before proceeding
    if (!updatedSection.section_id) {
      alert("Section ID is missing.");
      return;
    }

    // Debugging: Check the data being sent to the backend
    console.log("Saving updated section:", updatedSection);

    // Send only fields that are not null/undefined
    const updateData = {
      section_name: updatedSection.section_name,
      year_level: updatedSection.year_level,
      program_id: updatedSection.program_id,
      current_student: updatedSection.current_student,
      schedule: updatedSection.schedule,
    };

    // Filter out fields that are null or undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === null || updateData[key] === undefined
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin/section/${updatedSection.section_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the section");
      }

      const updatedSectionData = await response.json();

      // Update the section list with the newly updated section
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.section_id === updatedSectionData.section_id
            ? updatedSectionData
            : section
        )
      );

      setIsEditModalOpen(false);
      setSelectedSection(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (section) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the section "${section.section_name}"?`
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/admin/section/${section.section_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the section");
        }

        // Remove the deleted section from the state
        setSections((prevSections) =>
          prevSections.filter((s) => s.section_id !== section.section_id)
        );
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      program_name: programs.find(
        (program) => program.program_id === section.program_id
      )?.program_name, // Map program_id to program_name
    }))
    .filter((section) => {
      const matchesSearch = Object.values(section)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesYear = !filterYear || section.year_level === filterYear;
      return matchesSearch && matchesYear;
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
          <CardTitle>Sections List</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading sections...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <FilterComponent
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={[
                {
                  key: "yearLevel",
                  value: filterYear,
                  options: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
                  placeholder: "All Years",
                },
              ]}
              onFilterChange={(key, value) => {
                if (key === "yearLevel") {
                  setFilterYear(value);
                }
              }}
            />

            <DataTable
              columns={[
                { header: "Section Name", key: "section_name" },
                { header: "Year Level", key: "year_level" },
                { header: "Program", key: "program_name" }, // Display program_name here
                { header: "Students", key: "current_student" },
                { header: "Schedule", key: "schedule" },
              ]}
              data={filteredSections}
              onEdit={handleEdit}
              onDelete={handleDelete} // Pass the delete handler
              darkMode={darkMode}
            />

            {selectedSection && (
              <EditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedSection(null);
                }}
                onSave={handleSave}
                data={selectedSection}
                fields={editFields}
                title="Section"
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionsView;
