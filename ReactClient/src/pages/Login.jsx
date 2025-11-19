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
        navigate('/');
        const profile = await getAccountApi().catch(() => null);
        if (profile?.data) {
          login(profile.data, res.data.access_token);
        }
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
        <Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
          Chào mừng trở lại 👋
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
          Đăng nhập để quản lý người dùng và thử API bảo mật.
        </Text>
      </div>

      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleLogin}
      >
        <Form.Item
          label={<span style={{ color: '#fff' }}>Email</span>}
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email không hợp lệ',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="nhapemail@domain.com"
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#fff' }}>Mật khẩu</span>}
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            {
              min: 6,
              message: 'Mật khẩu tối thiểu 6 ký tự',
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••"
          />
        </Form.Item>

        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <Link to="/register">Chưa có tài khoản?</Link>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </Flex>

        <Button type="primary" block size="large" htmlType="submit">
          Đăng nhập
        </Button>
      </Form>
    </Flex>
  );
};

export default LoginPage;
