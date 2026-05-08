import React, { useEffect, useState } from "react";
import SchoolMap from "../components/SchoolMap";
import SchoolSearch from "../components/SchoolSearch";
import SchoolSidebar from "../components/SchoolSidebar";
import type { School } from "../types/school";
import { fetchSchools } from "../services/schoolsService";

const ExplorePage: React.FC = () => {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schools on component mount
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const schools = await fetchSchools();
        setAllSchools(schools);
        setFilteredSchools(schools);
      } catch (err) {
        console.error("Failed to load schools:", err);
        setError("Failed to load schools. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-lg font-semibold text-gray-700">Loading CUNY campuses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure the API server is running on http://localhost:5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-100">
      {/* Search Sidebar */}
      <SchoolSearch schools={allSchools} onFilter={setFilteredSchools} />

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <SchoolMap
          schools={filteredSchools}
          selectedSchool={selectedSchool}
          onSchoolClick={setSelectedSchool}
        />

        {/* Results Counter */}
        <div className="absolute bottom-6 left-96 bg-white px-4 py-2 rounded-lg shadow-md text-gray-700 font-semibold">
          {filteredSchools.length} campus{filteredSchools.length !== 1 ? "es" : ""} found
        </div>
      </div>

      {/* School Details Sidebar */}
      <SchoolSidebar school={selectedSchool} onClose={() => setSelectedSchool(null)} />
    </div>
  );
};

export default ExplorePage;
