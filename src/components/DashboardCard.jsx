import { Link } from "react-router-dom";

const DashboardCard = ({ title, value, icon, to }) => {
  const CardContent = (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="text-blue-600 text-3xl">{icon}</div>
    </div>
  );

  return to ? (
    <Link to={to} className="block">{CardContent}</Link>
  ) : (
    CardContent
  );
};

export default DashboardCard;