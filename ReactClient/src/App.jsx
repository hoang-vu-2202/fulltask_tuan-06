import { ConfigProvider } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';

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
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
