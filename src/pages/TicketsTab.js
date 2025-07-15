import React, { useEffect, useState } from 'react';
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TicketsTab = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenModal = (ticket = null) => {
    if (ticket) {
      setForm({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority
      });
      setEditId(ticket._id);
    } else {
      setForm({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium'
      });
      setEditId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateTicket(editId, form);
    } else {
      await createTicket(form);
    }
    setModalOpen(false);
    fetchTickets();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this ticket?')) {
      await deleteTicket(id);
      fetchTickets();
    }
  };

  const filtered = tickets.filter((t) =>
    t.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Tickets</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => handleOpenModal()}
        >
          + New Ticket
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
      />

      {loading ? (
        <p>Loading...</p>
      ) : pageItems.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Created</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => (
                <tr key={t._id}>
                  <td className="py-2 px-4 border-b">{t.title}</td>
                  <td className="py-2 px-4 border-b">{t.description}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        t.status === 'open'
                          ? 'bg-green-200 text-green-800'
                          : t.status === 'in-progress'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b capitalize">{t.priority}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button onClick={() => handleOpenModal(t)} className="text-blue-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
              {editId ? 'Edit Ticket' : 'Create Ticket'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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

export default TicketsTab;