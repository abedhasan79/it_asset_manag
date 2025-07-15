import React, { useEffect, useState } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AssetsTab = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        type: '',
        serialNumber: '',
        location: '',
        purchaseDate: '',
        warrantyExpiry: '',
        notes: ''
    });

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const res = await getAssets();
            setAssets(res.data);
        } catch (err) {
            setError('Failed to load assets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleOpenCreate = () => {
        setForm({
            name: '',
            type: '',
            serialNumber: '',
            location: '',
            purchaseDate: '',
            warrantyExpiry: '',
            notes: ''
        });
        setEditMode(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (asset) => {
        setForm({
            name: asset.name,
            type: asset.type,
            serialNumber: asset.serialNumber,
            location: asset.location || '',
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
            warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.substring(0, 10) : '',
            notes: asset.notes || ''
        });
        setEditMode(true);
        setCurrentId(asset._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this asset?')) {
            await deleteAsset(id);
            fetchAssets();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editMode) {
            await updateAsset(currentId, form);
        } else {
            await createAsset(form);
        }

        setShowModal(false);
        setForm({ name: '', type: '', serialNumber: '', status: '' });
        fetchAssets();
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.type.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination setup (client-side)
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
    const paginatedAssets = filteredAssets.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Assets</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleOpenCreate}
                >
                    + New Asset
                </button>
            </div>

            <input
                type="text"
                placeholder="Search by name or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 px-3 py-2 border rounded w-full max-w-md"
            />

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : paginatedAssets.length === 0 ? (
                <p>No assets found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Serial</th>
                                <th className="py-2 px-4 border-b">Location</th>
                                <th className="py-2 px-4 border-b">purchase Date</th>
                                <th className="py-2 px-4 border-b">Warranty Expiry Date</th>
                                <th className="py-2 px-4 border-b">Note</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAssets.map((asset) => (
                                <tr key={asset._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{asset.name}</td>
                                    <td className="py-2 px-4 border-b">{asset.type}</td>
                                    <td className="py-2 px-4 border-b">{asset.serialNumber}</td>
                                    <td className="py-2 px-4 border-b">{asset.location}</td>
                                    <td className="py-2 px-4 border-b">{asset.purchaseDate.slice(0,10)}</td>
                                    <td className="py-2 px-4 border-b">{asset.warrantyExpiry.slice(0,10)}</td>
                                    <td className="py-2 px-4 border-b">{asset.notes}</td>
                                    <td className="py-2 px-4 border-b space-x-2">
                                        <button
                                            onClick={() => handleOpenEdit(asset)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(asset._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md shadow">
                        <h3 className="text-lg font-semibold mb-4">
                            {editMode ? 'Edit Asset' : 'Add New Asset'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Asset Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="w-full border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Asset Type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                required
                                className="w-full border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Serial Number"
                                value={form.serialNumber}
                                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                                required
                                className="w-full border px-3 py-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Location"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <input
                                type="date"
                                placeholder="Purchase Date"
                                value={form.purchaseDate}
                                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <input
                                type="date"
                                placeholder="Warranty Expiry"
                                value={form.warrantyExpiry}
                                onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
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
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsTab;