import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Pages
import LandingPage from './pages/public/LandingPage';
import UploadPage from './pages/public/UploadPage';
import TrackJobPage from './pages/public/TrackJobPage';
import RegisterShopPage from './pages/public/RegisterShopPage';
import LoginPage from './pages/login/LoginPage';
import ChangePasswordPage from './pages/login/ChangePasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import AdminDashboard from './pages/shop-admin/AdminDashboard';
import AdminJobsList from './pages/shop-admin/AdminJobsList';
import AdminJobDetail from './pages/shop-admin/AdminJobDetail';
import AdminProfile from './pages/shop-admin/AdminProfile';

// Super Admin Pages
import SuperDashboard from './pages/super-admin/SuperDashboard';
import SuperShopsList from './pages/super-admin/SuperShopsList';
import SuperCreateShop from './pages/super-admin/SuperCreateShop';
import SuperJobsList from './pages/super-admin/SuperJobsList';
import SuperAnalytics from './pages/super-admin/SuperAnalytics';

// Loading Indicator Component for premium feel
const FullScreenLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs text-muted font-mono mt-4 tracking-widest uppercase font-semibold">Initializing Spooler...</span>
  </div>
);

// Route Protection wrappers
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shops/:slug" element={<UploadPage />} />
        <Route path="/shops/:slug/upload" element={<UploadPage />} />
        <Route path="/track/:token" element={<TrackJobPage />} />
        <Route path="/register" element={<RegisterShopPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Shop Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminJobsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs/:jobId" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminJobDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/profile" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings/password" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ChangePasswordPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Super Admin Routes */}
        <Route 
          path="/superadmin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/shops" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperShopsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/shops/new" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperCreateShop />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/jobs" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperJobsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/analytics" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAnalytics />
            </ProtectedRoute>
          } 
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
