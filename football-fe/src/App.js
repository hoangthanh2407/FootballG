import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
// import UserLayout from './layouts/UserLayout';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminTeams from './pages/admin/Teams';
import AdminMatches from './pages/admin/Matches';
import AdminPredictions from './pages/admin/Predictions';

// User Pages
// import Home from './pages/Home';
// import UserLogin from './pages/user/Login';
// import UserDashboard from './pages/user/Dashboard';
// import UserMatches from './pages/user/Matches';
// import UserPredictionHistory from './pages/user/PredictionHistory';
// import UserRankings from './pages/user/Rankings';

// Common Pages
import NotFound from './pages/NotFound';

// Route Guards
import PrivateRoute from './routes/PrivateRoutes';
import AdminRoute from './routes/AdminRoutes';

const App = () => {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Home Route */}
            {/* <Route path="/" element={<Home />} />

            <Route path="/login" element={<UserLogin />} />
            <Route path="/user" element={<UserLayout />}>
              <Route path="dashboard" element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } />
              <Route path="matches" element={
                <PrivateRoute>
                  <UserMatches />
                </PrivateRoute>
              } />
              <Route path="predictions" element={
                <PrivateRoute>
                  <UserPredictionHistory />
                </PrivateRoute>
              } />
              <Route path="rankings" element={
                <PrivateRoute>
                  <UserRankings />
                </PrivateRoute>
              } />
            </Route> */}

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              <Route path="teams" element={
                <AdminRoute>
                  <AdminTeams />
                </AdminRoute>
              } />
              <Route path="matches" element={
                <AdminRoute>
                  <AdminMatches />
                </AdminRoute>
              } />
              <Route path="predictions" element={
                <AdminRoute>
                  <AdminPredictions />
                </AdminRoute>
              } />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;