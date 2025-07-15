import React, { useEffect, useState } from 'react';
import {
  getLicenses,
  createLicense,
  updateLicense,
  deleteLicense
} from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const LicensesTab = () => {
  const [licenses, setLicenses] = useState([]);
  const [form, setForm] = useState({
    softwareName: '',
    licenseKey: '',
    purchaseDate: '',
    renewalDate: '',
    notes: ''
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await getLicenses();
      setLicenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleOpenModal = (license = null) => {
    if (license) {
      setForm({
        softwareName: license.softwareName,
        licenseKey: license.licenseKey,
        purchaseDate: license.purchaseDate?.substring(0, 10) || '',
        renewalDate: license.renewalDate?.substring(0, 10) || '',
        notes: license.notes || ''
      });
      setEditId(license._id);
    } else {
      setForm({
        softwareName: '',
        licenseKey: '',
        purchaseDate: '',
        renewalDate: '',
        notes: ''
      });
      setEditId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateLicense(editId, form);
    } else {
      await createLicense(form);
    }
    setModalOpen(false);
    setForm({
      softwareName: '',
      licenseKey: '',
      purchaseDate: '',
      renewalDate: '',
      notes: ''
    });
    setEditId(null);
    fetchLicenses();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this license?')) {
      await deleteLicense(id);
      fetchLicenses();
    }
  };

  const filtered = licenses.filter((l) =>
    l.softwareName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Licenses</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => handleOpenModal()}
        >
          + New License
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by software name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
      />

      {loading ? (
        <p>Loading...</p>
      ) : pageItems.length === 0 ? (
        <p>No licenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">Software</th>
                <th className="py-2 px-4 border-b">Key</th>
                <th className="py-2 px-4 border-b">Purchase</th>
                <th className="py-2 px-4 border-b">Renewal</th>
                <th className="py-2 px-4 border-b">Notes</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((l) => (
                <tr key={l._id}>
                  <td className="py-2 px-4 border-b">{l.softwareName}</td>
                  <td className="py-2 px-4 border-b">{l.licenseKey}</td>
                  <td className="py-2 px-4 border-b">
                    {l.purchaseDate?.substring(0, 10)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {l.renewalDate?.substring(0, 10)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {l.notes}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleOpenModal(l)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? 'Edit License' : 'Add License'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Software Name"
                value={form.softwareName}
                onChange={(e) => setForm({ ...form, softwareName: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="License Key"
                value={form.licenseKey}
                onChange={(e) => setForm({ ...form, licenseKey: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensesTab;