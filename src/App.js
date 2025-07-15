import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import AssetsTab from './pages/AssetsTab';
// import LicensesTab from './pages/LicensesTab';
// import TicketsTab from './pages/TicketsTab';
// import ProfileTab from './pages/ProfileTab';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />

        {isLoggedIn && (
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="assets" element={<AssetsTab />} />
            {/* <Route path="licenses" element={<LicensesTab />} /> */}
            {/* <Route path="tickets" element={<TicketsTab />} /> */}
            {/* <Route path="profile" element={<ProfileTab />} /> */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
