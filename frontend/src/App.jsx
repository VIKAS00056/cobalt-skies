import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import GamesPage from './pages/GamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboardPage from './pages/UserDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminGamesPage from './pages/admin/AdminGamesPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

export const App = () => {
  return (
    <Routes>
      {/* Public and Participant Facing Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:identifier" element={<EventDetailsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="games/:identifier" element={<GameDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="games" element={<AdminGamesPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
