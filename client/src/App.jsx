import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.jsx';
import { OfflineBanner } from './components/ui/OfflineBanner.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import MapPage from './pages/Map.jsx';
import MyComplaints from './pages/MyComplaints.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
