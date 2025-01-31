import React from "react";
import { Search, Filter } from "lucide-react";

const FilterComponent = ({
  searchTerm = "",
  onSearchChange = () => {},
  filters = [],
  onFilterChange = () => {},
}) => (
  <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
        size={20}
      />
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    {Array.isArray(filters) &&
      filters.map((filter, index) => (
        <div className="relative" key={filter.key || index}>
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <select
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
            value={filter.value || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          >
            <option value="">{filter.placeholder || "Select..."}</option>
            {Array.isArray(filter.options) &&
              filter.options.map((option, idx) => (
                <option key={`${option}-${idx}`} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      ))}
  </div>
);

export default FilterComponent;
