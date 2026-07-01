import React, { useState } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('lcs_admin_logged_in') === 'true' || sessionStorage.getItem('lcs_admin_logged_in') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState(() => {
    return localStorage.getItem('lcs_admin_email') || sessionStorage.getItem('lcs_admin_email') || '';
  });

  const handleAdminLogin = (email: string, rememberMe: boolean) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('lcs_admin_logged_in', 'true');
    storage.setItem('lcs_admin_email', email);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail('');
    localStorage.removeItem('lcs_admin_logged_in');
    localStorage.removeItem('lcs_admin_email');
    localStorage.removeItem('lcs_admin_token');
    localStorage.removeItem('lcs_admin_refresh_token');
    sessionStorage.removeItem('lcs_admin_logged_in');
    sessionStorage.removeItem('lcs_admin_email');
    sessionStorage.removeItem('lcs_admin_token');
    sessionStorage.removeItem('lcs_admin_refresh_token');
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
