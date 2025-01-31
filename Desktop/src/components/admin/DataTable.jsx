import React from "react";
import { Edit, Trash2 } from "lucide-react";

const DataTable = ({ columns, data, onEdit, onDelete, darkMode }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr
          className={`border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {columns.map((column, index) => (
            <th
              key={index}
              className={`px-4 py-3 text-left text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {column.header}
            </th>
          ))}
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-3 text-md ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {row[column.key]}
              </td>
            ))}
            <td className="px-4 py-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(row)}
                  className={`p-1 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className={`p-1 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
