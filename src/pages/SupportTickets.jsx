import React, { useState } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";

const initialTickets = [
    {
        id: 1,
        title: "Printer not working",
        asset: "Reception Printer",
        priority: "High",
        status: "Open",
        assignedTo: "John",
        description: "The printer won't connect to the network.",
        createdAt: "2024-07-09",
    },
    {
        id: 2,
        title: "Slow computer",
        asset: "Therapy Room PC",
        priority: "Medium",
        status: "In Progress",
        assignedTo: "Sarah",
        description: "Lagging during EMR use.",
        createdAt: "2024-07-10",
    },
];

const statusColors = {
    Open: "bg-red-100 text-red-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-blue-100 text-blue-700",
    Closed: "bg-green-100 text-green-700",
};

const priorityColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
};

const Tickets = () => {
    const [tickets, setTickets] = useState(initialTickets);
    const [query, setQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [sortKey, setSortKey] = useState("priority");
    const [sortAsc, setSortAsc] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        asset: "",
        priority: "Low",
        status: "Open",
        assignedTo: "",
        description: "",
    });

    const toggleModal = () => setModalOpen(!modalOpen);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const startAdd = () => {
        setEditId(null);
        setFormData({
            title: "",
            asset: "",
            priority: "Low",
            status: "Open",
            assignedTo: "",
            description: "",
        });
        setModalOpen(true);
    };

    const startEdit = (ticket) => {
        setEditId(ticket.id);
        setFormData(ticket);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            setTickets((prev) => prev.filter((t) => t.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.asset || !formData.description) return;

        if (editId) {
            setTickets((prev) =>
                prev.map((t) => (t.id === editId ? { ...formData, id: editId } : t))
            );
        } else {
            const newTicket = {
                ...formData,
                id: Date.now(),
                createdAt: new Date().toISOString().split("T")[0],
            };
            setTickets((prev) => [...prev, newTicket]);
        }

        setModalOpen(false);
    };

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    const filteredTickets = tickets
        .filter(
            (t) =>
                t.title.toLowerCase().includes(query.toLowerCase()) ||
                t.asset.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
            return 0;
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Support Tickets</h1>

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
                        <FaPlus /> Add Ticket
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left bg-white shadow-md rounded-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b">Title</th>
                            <th className="p-3 border-b">Asset</th>
                            <th
                                className="p-3 border-b cursor-pointer"
                                onClick={() => handleSort("priority")}
                            >
                                Priority {sortKey === "priority" && (sortAsc ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                            </th>
                            <th
                                className="p-3 border-b cursor-pointer"
                                onClick={() => handleSort("status")}
                            >
                                Status {sortKey === "status" && (sortAsc ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                            </th>
                            <th className="p-3 border-b">Assigned</th>
                            <th className="p-3 border-b">Created</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{ticket.title}</td>
                                    <td className="p-3 border-b">{ticket.asset}</td>
                                    <td className="p-3 border-b">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${priorityColors[ticket.priority]}`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${statusColors[ticket.status]}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b">{ticket.assignedTo}</td>
                                    <td className="p-3 border-b">{ticket.createdAt}</td>
                                    <td className="p-3 border-b space-x-2">
                                        <button
                                            onClick={() => startEdit(ticket)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            <FaEdit className="inline mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
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
                                    No tickets found.
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
                            {editId ? "Edit Ticket" : "Create Ticket"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="asset"
                                placeholder="Related Asset"
                                value={formData.asset}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Issue Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            ></textarea>
                            <input
                                type="text"
                                name="assignedTo"
                                placeholder="Assigned To"
                                value={formData.assignedTo}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            />
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
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

export default Tickets;