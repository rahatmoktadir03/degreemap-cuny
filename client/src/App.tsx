import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./store/DarkModeContext";
import { AuthProvider } from "./store/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import SchoolDetailPage from "./pages/SchoolDetailPage";
import RoadmapBuilderPage from "./pages/RoadmapBuilderPage";
import JourneyDashboardPage from "./pages/JourneyDashboardPage";
import AdvisorDashboardPage from "./pages/AdvisorDashboardPage";
import SharedRoadmapPage from "./pages/SharedRoadmapPage";
import MigrateLocalRoadmapsPage from "./pages/MigrateLocalRoadmapsPage";

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/schools/:id" element={<SchoolDetailPage />} />
              <Route path="/share/:token" element={<SharedRoadmapPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/roadmap-builder" element={<RoadmapBuilderPage />} />
                <Route path="/roadmap/:id" element={<RoadmapBuilderPage />} />
                <Route path="/journey" element={<JourneyDashboardPage />} />
                <Route path="/advisor" element={<AdvisorDashboardPage />} />
                <Route path="/advisor/:studentId" element={<AdvisorDashboardPage />} />
                <Route path="/migrate" element={<MigrateLocalRoadmapsPage />} />
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
