import { ConfigProvider } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import ProductSearch from './pages/ProductSearch';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4facfe',
          borderRadiusLG: 12,
        },
        components: {
          Button: {
            controlHeight: 44,
            fontWeight: 600,
          },
        },
      }}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          }
        />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="products" element={<ProductSearch />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
