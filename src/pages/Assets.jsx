import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const initialAssets = [
  { id: 1, name: "Reception PC", type: "PC", serial: "PC-001", status: "Active" },
  { id: 2, name: "Printer HP 2035", type: "Printer", serial: "PR-008", status: "Active" },
  { id: 3, name: "Therapy Router", type: "Router", serial: "RT-452", status: "Inactive" },
];

const Assets = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null = adding

  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serial: "",
    status: "Active",
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const startAdd = () => {
    setEditId(null);
    setFormData({ name: "", type: "", serial: "", status: "Active" });
    setModalOpen(true);
  };

  const startEdit = (asset) => {
    setEditId(asset.id);
    setFormData(asset);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.serial) return;

    if (editId) {
      setAssets((prev) =>
        prev.map((a) => (a.id === editId ? { ...formData, id: editId } : a))
      );
    } else {
      const newAsset = { ...formData, id: Date.now() };
      setAssets((prev) => [...prev, newAsset]);
    }

    setModalOpen(false);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this asset?");
    if (confirm) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
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
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{asset.name}</td>
                  <td className="p-3 border-b">{asset.type}</td>
                  <td className="p-3 border-b">{asset.serial}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        asset.status === "Active"
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
                      onClick={() => handleDelete(asset.id)}
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
                name="serial"
                placeholder="Serial Number"
                value={formData.serial}
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