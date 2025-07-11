import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'PCs', value: 30 },
  { name: 'Printers', value: 10 },
  { name: 'Routers', value: 12 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // blue, green, yellow

const AssetChart = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-72">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Assets by Type</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={60}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;