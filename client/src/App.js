import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function App() {
    return (_jsx(DarkModeProvider, { children: _jsx(AuthProvider, { children: _jsxs(BrowserRouter, { children: [_jsxs("div", { className: "min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors", children: [_jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/explore", element: _jsx(ExplorePage, {}) }), _jsx(Route, { path: "/schools/:id", element: _jsx(SchoolDetailPage, {}) }), _jsx(Route, { path: "/share/:token", element: _jsx(SharedRoadmapPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/roadmap-builder", element: _jsx(RoadmapBuilderPage, {}) }), _jsx(Route, { path: "/roadmap/:id", element: _jsx(RoadmapBuilderPage, {}) }), _jsx(Route, { path: "/journey", element: _jsx(JourneyDashboardPage, {}) }), _jsx(Route, { path: "/advisor", element: _jsx(AdvisorDashboardPage, {}) }), _jsx(Route, { path: "/advisor/:studentId", element: _jsx(AdvisorDashboardPage, {}) })] })] })] }), _jsx(Toaster, { position: "top-right" })] }) }) }));
}
export default App;
