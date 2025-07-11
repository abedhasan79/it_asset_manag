import React, { useState } from "react";

const Settings = () => {
  const [clinic, setClinic] = useState({
    name: "Nova Wellness Clinic",
    email: "info@novaclinic.ca",
    phone: "(902) 123-4567",
    address: "123 Main St, Halifax, NS",
  });

  const [notifications, setNotifications] = useState({
    licenseReminders: true,
    warrantyReminders: false,
  });

  const handleClinicChange = (e) => {
    const { name, value } = e.target;
    setClinic((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    // This will eventually make an API call to save changes
    console.log("Saving settings:", { clinic, notifications });
    alert("Settings saved!");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Clinic Profile */}
      <section className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Clinic Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={clinic.name}
            onChange={handleClinicChange}
            className="border px-4 py-2 rounded-md"
            placeholder="Clinic Name"
          />
          <input
            type="email"
            name="email"
            value={clinic.email}
            onChange={handleClinicChange}
            className="border px-4 py-2 rounded-md"
            placeholder="Clinic Email"
          />
          <input
            type="tel"
            name="phone"
            value={clinic.phone}
            onChange={handleClinicChange}
            className="border px-4 py-2 rounded-md"
            placeholder="Phone Number"
          />
          <input
            type="text"
            name="address"
            value={clinic.address}
            onChange={handleClinicChange}
            className="border px-4 py-2 rounded-md col-span-1 md:col-span-2"
            placeholder="Clinic Address"
          />
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="licenseReminders"
              checked={notifications.licenseReminders}
              onChange={handleToggle}
            />
            License expiry reminders
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="warrantyReminders"
              checked={notifications.warrantyReminders}
              onChange={handleToggle}
            />
            Warranty expiry reminders
          </label>
        </div>
      </section>

      {/* Billing Info – Placeholder */}
      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 text-gray-500">
        <h2 className="text-xl font-semibold text-gray-700">Plan & Billing</h2>
        <p>You're currently on the <strong>Pro Plan ($49/mo)</strong>.</p>
        <button className="text-blue-600 hover:underline">Manage billing</button>
      </section>

      {/* User Management – Placeholder */}
      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 text-gray-500">
        <h2 className="text-xl font-semibold text-gray-700">User Management</h2>
        <p>User roles, access permissions, and invitations coming soon.</p>
        <button className="text-blue-600 hover:underline">Invite User (Coming Soon)</button>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;