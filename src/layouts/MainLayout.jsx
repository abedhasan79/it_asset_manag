import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-100 flex-col">
            {/* Navbar always visible */}
            <Navbar onToggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                <main className="flex-1 overflow-auto p-6 md:pl-59">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;