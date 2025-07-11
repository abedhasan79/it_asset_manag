import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaCalendarAlt,
} from "react-icons/fa";

const initialLicenses = [
  {
    id: 1,
    name: "Microsoft 365",
    software: "Office Suite",
    expiry: "2025-08-15",
    seats: 10,
    status: "Active",
  },
  {
    id: 2,
    name: "Norton Antivirus",
    software: "Antivirus",
    expiry: "2024-07-20",
    seats: 5,
    status: "Active",
  },
  {
    id: 3,
    name: "Clinic EMR",
    software: "EMR System",
    expiry: "2024-05-10",
    seats: 3,
    status: "Expired",
  },
];

const Licenses = () => {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    software: "",
    expiry: "",
    seats: "",
    status: "Active",
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const startAdd = () => {
    setEditId(null);
    setFormData({
      name: "",
      software: "",
      expiry: "",
      seats: "",
      status: "Active",
    });
    setModalOpen(true);
  };

  const startEdit = (license) => {
    setEditId(license.id);
    setFormData(license);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.software || !formData.expiry || !formData.seats) return;

    if (editId) {
      setLicenses((prev) =>
        prev.map((l) => (l.id === editId ? { ...formData, id: editId } : l))
      );
    } else {
      const newLicense = { ...formData, id: Date.now() };
      setLicenses((prev) => [...prev, newLicense]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this license?")) {
      setLicenses((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // Calculate days to expiry and color class
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired"; // expired
    if (diffDays <= 30) return "expiring"; // expiring soon (30 days)
    return "ok"; // healthy
  };

  const filteredLicenses = licenses
    .filter(
      (l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.software.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "expiry") {
        const dateA = new Date(a.expiry);
        const dateB = new Date(b.expiry);
        return sortAsc ? dateA - dateB : dateB - dateA;
      } else {
        if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
        return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Licenses</h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Search by name or software..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64"
          />
          <button
            onClick={startAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add License
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left bg-white shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortKey === "name" && (sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
              </th>
              <th className="p-3 border-b">Software</th>
              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => handleSort("expiry")}
              >
                Expiry Date {sortKey === "expiry" && (sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
              </th>
              <th className="p-3 border-b">Seats</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((license) => {
                const expiryStatus = getExpiryStatus(license.expiry);
                return (
                  <tr
                    key={license.id}
                    className={`hover:bg-gray-50 ${
                      expiryStatus === "expired"
                        ? "bg-red-50"
                        : expiryStatus === "expiring"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="p-3 border-b">{license.name}</td>
                    <td className="p-3 border-b">{license.software}</td>
                    <td className="p-3 border-b flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(license.expiry).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b">{license.seats}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          license.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {license.status}
                      </span>
                    </td>
                    <td className="p-3 border-b space-x-2">
                      <button
                        onClick={() => startEdit(license)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(license.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        <FaTrash className="inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-6">
                  No licenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit License" : "Add New License"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="License Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="software"
                placeholder="Software Name"
                value={formData.software}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                name="expiry"
                placeholder="Expiry Date"
                value={formData.expiry}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                min="1"
                name="seats"
                placeholder="Seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Licenses;