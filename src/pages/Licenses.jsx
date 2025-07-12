import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";
import {
  fetchLicenses,
  createLicense,
  updateLicense,
  deleteLicense,
} from "../services/api";

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    vendor: "",
    key: "",
    startDate: "",
    expiryDate: "",
    seats: 1,
    assignedTo: "",
    status: "Active",
  });

  const loadLicenses = async () => {
    const data = await fetchLicenses();
    setLicenses(data);
  };

  useEffect(() => {
    loadLicenses();
  }, []);


  const toggleModal = () => setModalOpen(!modalOpen);

  const startAdd = () => {
    setEditId(null);
    setFormData({
      name: "",
      vendor: "",
      key: "",
      startDate: "",
      expiryDate: "",
      seats: 1,
      assignedTo: "",
      status: "Active",
    });
    setModalOpen(true);
  };

  const startEdit = (license) => {
    setEditId(license._id);
    setFormData({
      name: license.name,
      vendor: license.vendor,
      key: license.key,
      startDate: license.startDate?.slice(0, 10),
      expiryDate: license.expiryDate?.slice(0, 10),
      seats: license.seats || 1,
      assignedTo: license.assignedTo || "",
      status: license.status || "Active",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
    };

    try {
      if (editId) {
        const updated = await updateLicense(editId, payload);
        updated.status = new Date(updated.expiryDate) >= new Date() ? "Active" : "Inactive";
        setLicenses((prev) =>
          prev.map((l) => (l._id === editId ? updated : l))
        );
      } else {
        const newOne = await createLicense(payload);
        setLicenses((prev) => [...prev, newOne]);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Error saving license");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this license?")) return;
    await deleteLicense(id);
    setLicenses((prev) => prev.filter((l) => l._id !== id));
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = licenses
    .filter(
      (l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.vendor.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Licenses</h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Search..."
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
              <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortKey === "name" && (sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
              </th>
              <th className="p-3 border-b">Vendor</th>
              <th className="p-3 border-b">Key</th>
              <th className="p-3 border-b">Seats</th>
              <th className="p-3 border-b">Assigned To</th>
              <th className="p-3 border-b">Start Date</th>
              <th className="p-3 border-b">Expiry Date</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((l) => (
                <tr key={l._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{l.name}</td>
                  <td className="p-3 border-b">{l.vendor}</td>
                  <td className="p-3 border-b">{l.key}</td>
                  <td className="p-3 border-b">{l.seats}</td>
                  <td className="p-3 border-b">{l.assignedTo}</td>
                  <td className="p-3 border-b">{l.startDate?.slice(0, 10)}</td>
                  <td className="p-3 border-b">{l.expiryDate?.slice(0, 10)}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${l.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 border-b space-x-2">
                    <button
                      onClick={() => startEdit(l)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-6">
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
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="vendor"
                placeholder="Vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="key"
                placeholder="License Key"
                value={formData.key}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <input
                type="number"
                name="seats"
                placeholder="Seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="assignedTo"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              {/* <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select> */}

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