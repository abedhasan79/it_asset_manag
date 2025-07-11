import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";

// Placeholder pages

const Licenses = () => <div><h2>Licenses Page</h2></div>;
const Tickets = () => <div><h2>Tickets Page</h2></div>;
const Settings = () => <div><h2>Settings Page</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="licenses" element={<Licenses />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
