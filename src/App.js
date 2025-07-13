import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Licenses from "./pages/Licenses";
import Tickets from "./pages/SupportTickets";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="licenses" element={<Licenses />} />
          <Route path="/tickets" element={<Tickets user={user} />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
