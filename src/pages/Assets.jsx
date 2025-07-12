import React, { useEffect, useState } from "react";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serialNumber: null,
    purchaseDate: "",
    warrantyExpiry: null,
    assignedTo: "",
    location: "",
    status: "Active",
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const startAdd = () => {
    setEditId(null);
    setFormData({ name: "", type: "", serial: "", status: "Active" });
    setModalOpen(true);
  };

  const startEdit = (asset) => {
    setEditId(asset._id);
    setFormData({
      name: asset.name || "",
      type: asset.type || "",
      serialNumber: asset.serialNumber || "",
      status: asset.status || "Active",
      purchaseDate: asset.purchaseDate
        ? asset.purchaseDate.slice(0, 10)
        : "",
      warrantyExpiry: asset.warrantyExpiry
        ? asset.warrantyExpiry.slice(0, 10)
        : "",
      assignedTo: asset.assignedTo || "",
      location: asset.location || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.serialNumber) return;

    // Convert date strings to Date objects
    const payload = {
      ...formData,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
      warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry) : null,
    };

    try {
      if (editId) {
        const updated = await updateAsset(editId, payload);
        setAssets((prev) =>
          prev.map((a) => (a._id === editId ? updated : a))
        );
      } else {
        const newAsset = await createAsset(payload);
        setAssets((prev) => [...prev, newAsset]);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Error saving asset");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this asset?");
    if (confirm) {
      try {
        await deleteAsset(id);
        setAssets((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert("Error deleting asset");
        console.error(err);
      }
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

  const filteredAssets = assets
    .filter(
      (asset) =>
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.type.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  if (loading) return <div className="p-6">Loading assets...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Assets</h1>

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
            <FaPlus /> Add Asset
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
              <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("type")}>
                Type {sortKey === "type" && (sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
              </th>
              <th className="p-3 border-b">Serial</th>
              <th className="p-3 border-b">Purchase Date</th>
              <th className="p-3 border-b">Warranty Expiry</th>
              <th className="p-3 border-b">Assigned To</th>
              <th className="p-3 border-b">Location</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{asset.name}</td>
                  <td className="p-3 border-b">{asset.type}</td>
                  <td className="p-3 border-b">{asset.serialNumber}</td>
                  <td className="p-3 border-b">{asset.purchaseDate.slice(0, 10)}</td>
                  <td className="p-3 border-b">{asset.warrantyExpiry.slice(0, 10)}</td>
                  <td className="p-3 border-b">{asset.assignedTo}</td>
                  <td className="p-3 border-b">{asset.location}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${asset.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-3 border-b space-x-2">
                    <button
                      onClick={() => startEdit(asset)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset._id)}
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
                <td colSpan="5" className="text-center text-gray-500 p-6">
                  No assets found.
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
              {editId ? "Edit Asset" : "Add New Asset"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Asset Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <input
                type="text"
                name="type"
                placeholder="Asset Type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                value={formData.serialNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />

              <input
                type="date"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <input
                type="text"
                name="assignedTo"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

export default Assets;