import DashboardCard from "../components/DashboardCard";
import AssetChart from "../components/AssetChart";
import LicenseBarChart from "../components/LicenseBarChart";
import { FaLaptop, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard to="/assets" title="Total Assets" value="52" icon={<FaLaptop />} />
                <DashboardCard to="/tickets" title="Open Tickets" value="4" icon={<FaTicketAlt />} />
                <DashboardCard to="/licenses" title="Expiring Licenses" value="3 this week" icon={<FaExclamationTriangle />} />
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AssetChart />
                <LicenseBarChart />

            </div>
        </div>
    );
};

export default Dashboard;
