import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", expiring: 1 },
  { month: "Feb", expiring: 3 },
  { month: "Mar", expiring: 2 },
  { month: "Apr", expiring: 5 },
  { month: "May", expiring: 0 },
  { month: "Jun", expiring: 4 },
  { month: "Jul", expiring: 2 },
  { month: "Aug", expiring: 1 },
  { month: "Sep", expiring: 3 },
  { month: "Oct", expiring: 6 },
  { month: "Nov", expiring: 2 },
  { month: "Dec", expiring: 1 },
];

const LicenseBarChart = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-72">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Licenses Expiring per Month
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="expiring" fill="#3B82F6" name="Expiring Licenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LicenseBarChart;