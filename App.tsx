
import React from 'react';
// Changed from react-router-dom to react-router to fix missing member errors in some environments
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import MyOrders from './pages/MyOrders';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: UserRole }> = ({ children, allowedRole }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Públicas */}
      <Route path="/" element={<Layout><Catalog /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

      {/* Rotas Privadas */}
      <Route path="/my-orders" element={
        <ProtectedRoute allowedRole={UserRole.CLIENT}>
          <Layout><MyOrders /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole={UserRole.ADMIN}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/products" element={
        <ProtectedRoute allowedRole={UserRole.ADMIN}>
          <Layout><AdminProducts /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/categories" element={
        <ProtectedRoute allowedRole={UserRole.ADMIN}>
          <Layout><AdminCategories /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRole={UserRole.ADMIN}>
          <Layout><AdminSettings /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
