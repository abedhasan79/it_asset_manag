import React, { useEffect, useState } from 'react';
import {
  getCurrentUser,
  getClinicInfo,
  updateUserInfo,
  changeUserPassword
} from '../services/api';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  const [infoForm, setInfoForm] = useState({ name: '', clinicName: '', clinicAddress: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const [infoMsg, setInfoMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, clinicRes] = await Promise.all([
          getCurrentUser(),
          getClinicInfo()
        ]);
        setProfile(userRes.data);
        setClinic(clinicRes.data);
        setInfoForm({
          name: userRes.data.name || '',
          clinicName: clinicRes.data.name || '',
          clinicAddress: clinicRes.data.address || ''
        });
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    setInfoMsg('');
    try {
      await updateUserInfo(infoForm);
      setInfoMsg('Info updated successfully.');
    } catch (err) {
      console.error(err);
      setInfoMsg('Failed to update info.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg('');
    try {
      await changeUserPassword(passwordForm);
      setPassMsg('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      setPassMsg('Failed to change password. Check current password.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile || !clinic) return <p>Profile not found.</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {/* Update Info */}
      <form onSubmit={handleInfoUpdate} className="space-y-4 mb-8">
        <h3 className="text-lg font-medium">Update Info</h3>
        {infoMsg && <div className="text-blue-600">{infoMsg}</div>}
        <input
          type="text"
          placeholder="Name"
          value={infoForm.name}
          onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Clinic Name"
          value={infoForm.clinicName}
          onChange={(e) => setInfoForm({ ...infoForm, clinicName: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Clinic Address"
          value={infoForm.clinicAddress}
          onChange={(e) => setInfoForm({ ...infoForm, clinicAddress: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Info
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        {passMsg && <div className="text-blue-600">{passMsg}</div>}
        <input
          type="password"
          placeholder="Current Password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;