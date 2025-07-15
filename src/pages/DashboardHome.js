import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis } from 'recharts';
import {
  getAssetSummary,
  getLicenseSummary,
  getTicketSummary
} from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalAssets, setTotalAssets] = useState(0);
  const [assetsByType, setAssetsByType] = useState([]);
  const [expiringWarranties, setExpiringWarranties] = useState([]);

  const [licensesExpiringSoon, setLicensesExpiringSoon] = useState(0);

  const [ticketsByStatus, setTicketsByStatus] = useState([]);

  // const [clinicsCount, setClinicsCount] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          assetRes,
          licenseRes,
          ticketRes
        ] = await Promise.all([
          getAssetSummary(),
          getLicenseSummary(),
          getTicketSummary()
        ]);

        setTotalAssets(assetRes.data.totalAssets);
        setAssetsByType(assetRes.data.assetsByType);
        setExpiringWarranties(assetRes.data.expiringWarranties);

        setLicensesExpiringSoon(licenseRes.data.expiringSoon);

        setTicketsByStatus(ticketRes.data.ticketsByStatus);
        console.log('Tickets by status:', ticketRes);
        // setClinicsCount(clinicRes.data.totalClinics);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Assets</h3>
          <p className="text-2xl">{totalAssets}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Licenses Expiring Soon</h3>
          <p className="text-2xl text-yellow-600">{licensesExpiringSoon}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Warranties Expiring Soon</h3>
          <p className="text-2xl text-yellow-600">{expiringWarranties.length}</p>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-lg font-semibold">Open Tickets</h3>
          <p className="text-2xl text-red-600">
            {
              ticketsByStatus
                .filter(t => t.status !== 'closed')
                .reduce((acc, curr) => acc + curr.count, 0)
            }
          </p>
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Clinics</h3>
          <p className="text-2xl">{clinicsCount}</p>
        </div> */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Assets by Type</h3>
          <BarChart width={200} height={200} data={assetsByType}>
            <Bar dataKey="count" fill="#088d82ff" label />
            <XAxis dataKey="type" />
            <Tooltip />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Tickets by Status</h3>
          <PieChart width={300} height={200}>
            <Pie
              data={ticketsByStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#82ca9d"
              label
            >
              {ticketsByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;