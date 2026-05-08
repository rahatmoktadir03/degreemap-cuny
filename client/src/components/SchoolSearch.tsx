import React from "react";
import type { School } from "../types/school";

interface SchoolSearchProps {
  schools: School[];
  onFilter: (filtered: School[]) => void;
}

type SchoolType = "all" | "senior" | "community" | "graduate";
type Borough = "all" | "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";

const SchoolSearch: React.FC<SchoolSearchProps> = ({ schools, onFilter }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<SchoolType>("all");
  const [selectedBorough, setSelectedBorough] = React.useState<Borough>("all");

  const boroughs: Borough[] = ["all", "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
  const schoolTypes: SchoolType[] = ["all", "senior", "community", "graduate"];

  const handleFilter = React.useCallback(() => {
    let filtered = schools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (school) =>
          school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.programs.some((prog) => prog.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((school) => school.type === selectedType);
    }

    // Filter by borough
    if (selectedBorough !== "all") {
      filtered = filtered.filter((school) => school.borough === selectedBorough);
    }

    onFilter(filtered);
  }, [schools, searchTerm, selectedType, selectedBorough, onFilter]);

  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedType, selectedBorough, handleFilter]);

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-40 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🗺️ CUNY Explorer</h2>
        <p className="text-secondary-100 text-sm">Explore all 25 CUNY campuses</p>
      </div>

      {/* Search and Filters */}
      <div className="p-6 space-y-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Search Schools</label>
          <input
            type="text"
            placeholder="Search by name or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition"
          />
        </div>

        {/* School Type Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">School Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as SchoolType)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition"
          >
            {schoolTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Types"
                  : type === "senior"
                    ? "Senior Colleges"
                    : type === "graduate"
                      ? "Graduate Institutions"
                      : "Community Colleges"}
              </option>
            ))}
          </select>
        </div>

        {/* Borough Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Borough</label>
          <select
            value={selectedBorough}
            onChange={(e) => setSelectedBorough(e.target.value as Borough)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition"
          >
            {boroughs.map((borough) => (
              <option key={borough} value={borough}>
                {borough === "all" ? "All Boroughs" : borough}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedType("all");
            setSelectedBorough("all");
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Legend */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>Click on any campus to see details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔵</span>
            <span>Blue circle shows selected campus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSearch;
