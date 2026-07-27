import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashboardV2';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PayRequest from './pages/PayRequest';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';

import AdminRoute from './components/AdminRoute';

import HomeV2 from './pages/HomeV2';

function App() {
  const token = localStorage.getItem('token');

  return (
      

   <BrowserRouter>
      <Routes>
        <Route
          path="/home-v2"
          element={<HomeV2 />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* RESET PASSWORD */}

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            token
              ? <Profile />
              : <Navigate to="/login" replace />
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* PAYMENT REQUEST */}

        <Route
          path="/pay/:requestId"
          element={<PayRequest />}
        />

        {/* DEFAULT */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                token
                  ? '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
