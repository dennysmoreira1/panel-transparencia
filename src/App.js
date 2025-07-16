import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas públicas
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Layout y módulos del dashboard
import DashboardLayout from './components/DashboardLayout';
import Inicio from './pages/dashboard/Inicio';
import Contrataciones from './pages/dashboard/Contrataciones';
import Presupuestos from './pages/dashboard/Presupuestos';
import Documentos from './pages/dashboard/Documentos';
import Estadisticas from './pages/dashboard/Estadisticas';
import Obras from './pages/dashboard/Obras';
import Sectores from './pages/dashboard/Sectores';
import Usuarios from './pages/dashboard/Usuarios';
import Reportes from './pages/dashboard/Reportes';

// 🔁 Evita acceso a login/register si ya está autenticado
const PublicOnlyRoute = ({ children }) => {
  const { accessToken } = useAuth();
  return accessToken ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
  return (
    <Routes>
      {/* 🟢 Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 🔒 Rutas protegidas dentro del layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Rutas accesibles a todos los roles autenticados */}
        <Route path="dashboard" element={<Inicio />} />
        <Route path="dashboard/estadisticas" element={<Estadisticas />} />
        <Route path="dashboard/documentos" element={<Documentos />} />

        {/* Accesibles a admin y editor */}
        <Route
          path="dashboard/contrataciones"
          element={
            <PrivateRoute requiredRole={['admin', 'editor']}>
              <Contrataciones />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/presupuestos"
          element={
            <PrivateRoute requiredRole={['admin', 'editor']}>
              <Presupuestos />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/obras"
          element={
            <PrivateRoute requiredRole={['admin', 'editor']}>
              <Obras />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/sectores"
          element={
            <PrivateRoute requiredRole={['admin', 'editor']}>
              <Sectores />
            </PrivateRoute>
          }
        />

        {/* Solo admin */}
        <Route
          path="dashboard/usuarios"
          element={
            <PrivateRoute requiredRole="admin">
              <Usuarios />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/reportes"
          element={
            <PrivateRoute requiredRole="admin">
              <Reportes />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
