import { Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import AdminSession from './pages/AdminSession';

export const adminRoutes = [
  <Route key="admin-home" path="/admin" element={<AdminHome />} />,
  <Route key="admin-session" path="/admin/session/:pin" element={<AdminSession />} />,
];