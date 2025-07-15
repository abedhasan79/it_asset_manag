import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItemStyle = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-200 font-semibold' : ''}`;

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-800 via-gray-600 to-gray-400 text-white p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <NavLink to="/dashboard" className={navItemStyle}>Dashboard</NavLink>
      <NavLink to="/assets" className={navItemStyle}>Assets</NavLink>
      <NavLink to="/licenses" className={navItemStyle}>Licenses</NavLink>
      <NavLink to="/tickets" className={navItemStyle}>Tickets</NavLink>
      <NavLink to="/profile" className={navItemStyle}>Profile</NavLink>
    </aside>
  );
};

export default Sidebar;