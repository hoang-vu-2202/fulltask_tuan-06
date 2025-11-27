import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi, getAccountApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    try {
      const res = await loginApi(values);
      if (res?.success && res?.data?.access_token) {
        login(res?.data?.user, res?.data?.access_token);
        message.success('Đăng nhập thành công!');

        const profile = await getAccountApi().catch(() => null);
        if (profile?.data) {
          login(profile.data, res.data.access_token);
        }

        // Navigate to products search page
        navigate('/products');
      } else {
        message.error(res?.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể đăng nhập');
    }
  };

  return (
    <Flex vertical gap={24}>
      <div>
        <Title level={3} style={{ marginBottom: 8, textAlign: 'center' }}>
          Chào mừng trở lại
        </Title>
      </div>

      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleLogin}
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="nhapemail@domain.com"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="••••••"
          />
        </Form.Item>

        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Link to="/register">Chưa có tài khoản?</Link>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </Flex>

        <Button type="primary" block htmlType="submit" size="large">
          Đăng nhập
        </Button>
      </Form>
    </Flex>
  );
};

export default LoginPage;
