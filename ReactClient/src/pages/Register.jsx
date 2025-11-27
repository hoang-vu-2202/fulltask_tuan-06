import { ArrowLeftOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../services/authApi';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const res = await registerApi(values);
      if (res?.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(res?.message || 'Không thể đăng ký');
      }
    } catch (error) {
      message.error(error?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <Flex vertical gap={24}>
      <div>
        <Link to="/login" style={{ display: 'inline-block', marginBottom: 16 }}>
          <ArrowLeftOutlined /> Quay lại đăng nhập
        </Link>
        <Title level={3} style={{ marginBottom: 8, textAlign: 'center' }}>
          Tạo tài khoản mới 🚀
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
          Nhập thông tin bên dưới để bắt đầu.
        </Text>
      </div>

      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleRegister}
        size="large"
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên' },
            { min: 3, message: 'Họ tên tối thiểu 3 ký tự' },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="email@domain.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Ít nhất 6 ký tự" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Button type="primary" block htmlType="submit" size="large" style={{ marginTop: 12 }}>
          Đăng ký
        </Button>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </Form>
    </Flex>
  );
};

export default RegisterPage;
