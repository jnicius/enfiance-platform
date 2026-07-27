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

import AdminDashboard from "./pages/AdminDashboard";

import AdminRoute from "./components/AdminRoute";

function App() {

  const token =
    localStorage.getItem('token');

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={
            token
              ? <Navigate to="/dashboard" />
              : <Register />
          }
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        {/* RESET PASSWORD */}

        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />


         <Route
           path="/admin"
           element={
             <AdminRoute>
               <AdminDashboard />
             </AdminRoute>
           }
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
            />
          }
        />
         <Route
  path="/pay/:requestId"
  element={<PayRequest />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
