import React, { useEffect, useState } from 'react';
import { getCurrentUser, getClinicInfo } from '../services/api';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, clinicRes] = await Promise.all([
          getCurrentUser(),
          getClinicInfo()
        ]);
        setProfile(userRes.data);
        setClinic(clinicRes.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="space-y-3">
        <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role || 'User'}</p>
        {clinic && (
          <>
            <p><strong>Clinic Name:</strong> {clinic.name || 'N/A'}</p>
            <p><strong>Address:</strong> {clinic.address || 'N/A'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;