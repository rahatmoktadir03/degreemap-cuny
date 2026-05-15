import React, { useEffect, useState } from "react";
import SchoolMap from "../components/SchoolMap";
import SchoolSearch from "../components/SchoolSearch";
import SchoolSidebar from "../components/SchoolSidebar";
import { DarkModeToggle } from "../components/DarkModeToggle";
import type { School } from "../types/school";
import { fetchSchools } from "../services/schoolsService";

const ExplorePage: React.FC = () => {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-subtle">🗺️</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading CUNY campuses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="card max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Make sure the API server is running on http://localhost:5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 text-white p-4 flex justify-between items-center z-50 shadow-lg">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <span>CUNY Explorer</span>
        </h1>
        <div className="flex gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-primary-700 dark:hover:bg-primary-700 rounded-lg transition duration-200"
            title="Toggle search"
          >
            🔍
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary-700 dark:hover:bg-primary-700 rounded-lg transition duration-200"
            title="Toggle details"
          >
            ℹ️
          </button>
        </div>
      </div>

      {/* Search Sidebar - Desktop always visible, Mobile toggle */}
      <div
        className={`w-full lg:w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-all duration-300 ${
          searchOpen ? "block" : "hidden lg:block"
        } h-auto lg:h-full`}
      >
        <SchoolSearch schools={allSchools} onFilter={setFilteredSchools} />
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden min-h-96 lg:min-h-screen">
        <SchoolMap
          schools={filteredSchools}
          selectedSchool={selectedSchool}
          onSchoolClick={setSelectedSchool}
        />

        {/* Results Counter */}
        <div className="absolute bottom-6 left-4 lg:left-96 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-md font-semibold text-sm lg:text-base">
          {filteredSchools.length} campus{filteredSchools.length !== 1 ? "es" : ""} found
        </div>
      </div>

      {/* School Details Sidebar - Desktop always visible, Mobile toggle */}
      {selectedSchool && (
        <div
          className={`w-full lg:w-96 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? "block" : "hidden lg:block"
          } h-auto lg:h-full`}
        >
          <SchoolSidebar school={selectedSchool} onClose={() => setSelectedSchool(null)} />
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
