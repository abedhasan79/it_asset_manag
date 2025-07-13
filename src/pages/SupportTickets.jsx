import React, { useEffect, useState } from "react";
import {
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchITStaff,
} from "../services/api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Tickets = ({ user }) => {
    const [allITStaff, setAllITStaff] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        submittedBy: "",
        assignedTo: "",
        asset: "",
        priority: "Low",
        status: "Open",
    });

    const loadTickets = async () => {
        if (!user) return;

        try {
            const all = await fetchTickets();
            let filtered = [];

            if (user.role === "admin") {
                filtered = all;
            } else if (user.role === "it") {
                // filtered = all.filter((t) => t.assignedTo === user.email);
                filtered = all;
            } else {
                filtered = all.filter((t) => t.submittedBy === user.email);
            }

            setTickets(filtered);
        } catch (err) {
            console.error("Error loading tickets:", err);
        }
    };

    useEffect(() => {
        if (!user) return;
        loadTickets();
        if (user?.role === "admin") {
            fetchITStaff().then(setAllITStaff).catch(console.error);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const startAdd = () => {
        setEditId(null);
        setFormData({
            title: "",
            description: "",
            submittedBy: user?.email || "",
            assignedTo: "",
            asset: "",
            priority: "Low",
            status: "Open",
        });
        setModalOpen(true);
    };

    const startEdit = (ticket) => {
        setEditId(ticket._id);
        setFormData(ticket);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const updated = await updateTicket(editId, formData);
                setTickets((prev) =>
                    prev.map((t) => (t._id === editId ? updated : t))
                );
            } else {
                const newTicket = await createTicket(formData);
                setTickets((prev) => [...prev, newTicket]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error saving ticket:", err);
            alert("Error saving ticket");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this ticket?")) return;
        try {
            await deleteTicket(id);
            setTickets((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Error deleting ticket");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Support Tickets</h1>
                <button
                    onClick={startAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus />
                    New Ticket
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white text-left shadow-sm rounded text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border-b">Title</th>
                            <th className="p-2 border-b">Asset</th>
                            <th className="p-2 border-b">Description</th>
                            <th className="p-2 border-b">Status</th>
                            <th className="p-2 border-b">Priority</th>
                            <th className="p-2 border-b">Submitted By</th>
                            <th className="p-2 border-b">Assigned To</th>
                            <th className="p-2 border-b">Date Created</th>
                            <th className="p-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((t) => (
                                <tr key={t._id} className={`hover:bg-gray-100 ${t.status === "Closed" ? "bg-gray-400" :t.priority === "High"
                                    ? "bg-red-100"
                                    : t.priority === "Medium"
                                        ? "bg-yellow-100"
                                        : "bg-green-100"
                                    }`}>
                                    <td className="p-2 border-b">{t.title}</td>
                                    <td className="p-2 border-b">{t.asset}</td>
                                    <td className="p-2 border-b">{t.description}</td>
                                    <td className="p-2 border-b">{t.status}</td>
                                    <td className="p-2 border-b">{t.priority}</td>
                                    <td className="p-2 border-b">{t.submittedBy}</td>
                                    <td className="p-2 border-b">{t.assignedTo}</td>
                                    <td className="p-2 border-b">{t.createdAt.slice(0, 10)}</td>
                                    <td className="p-2 border-b space-x-2">
                                        <button
                                            onClick={() => startEdit(t)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            <FaEdit />
                                        </button>
                                        {user?.role === "admin" && (
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))
                        ) : (

                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No tickets found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Ticket" : "New Ticket"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                required
                                readOnly={editId && user?.role !== "staff"}
                            />
                            <input
                                type="text"
                                name="asset"
                                placeholder="Asset"
                                value={formData.asset}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                required
                                readOnly={editId && user?.role !== "staff"}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                readOnly={editId && user?.role !== "staff"}
                            />

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={editId && user?.role !== "staff"}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>

                            {(user?.role === "admin" || user?.role === "it") && (
                                <>
                                    <select
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                        disabled={user?.role === "staff"}
                                    >
                                        <option value="">...</option>
                                        {user.role === "admin" &&
                                            allITStaff.map((staff) => (
                                                <>

                                                    <option key={staff._id} value={staff.email}>
                                                        {staff.name}
                                                    </option>
                                                </>
                                            ))}
                                        {user?.role === "it" && (
                                            <>

                                                <option value={user?.email}>{user?.name}</option>
                                            </>
                                        )}
                                    </select>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                    >
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Closed</option>
                                    </select>
                                </>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {editId ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tickets;