import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./store/AuthContext";
import { DarkModeProvider } from "./store/DarkModeContext";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { RoadmapBuilderPage } from "./pages/RoadmapBuilderPage";
import { JourneyDashboardPage } from "./pages/JourneyDashboardPage";
import { PublicRoadmapPage } from "./pages/PublicRoadmapPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <DarkModeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/roadmap/public/:shareId" element={<PublicRoadmapPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journey"
              element={
                <ProtectedRoute>
                  <JourneyDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
}

export default App;
