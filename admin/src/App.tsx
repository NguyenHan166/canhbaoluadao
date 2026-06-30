import React, { useState } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('lcs_admin_logged_in') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState(() => {
    return localStorage.getItem('lcs_admin_email') || '';
  });

  const handleAdminLogin = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    localStorage.setItem('lcs_admin_logged_in', 'true');
    localStorage.setItem('lcs_admin_email', email);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail('');
    localStorage.removeItem('lcs_admin_logged_in');
    localStorage.removeItem('lcs_admin_email');
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLoginSuccess={handleAdminLogin} />;
  }

  return (
    <AdminDashboard 
      adminEmail={adminEmail} 
      onLogout={handleAdminLogout} 
    />
  );
}
