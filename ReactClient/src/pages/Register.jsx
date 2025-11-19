import { ArrowLeftOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
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
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Link to="/login" style={{ color: '#fff' }}>
          <ArrowLeftOutlined /> Quay lại đăng nhập
        </Link>
      </Col>
      <Col span={24}>
        <Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
          Tạo tài khoản mới
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
          Nhập thông tin bên dưới để bắt đầu sử dụng hệ thống.
        </Text>
      </Col>

      <Col span={24}>
        <Form layout="vertical" form={form} requiredMark={false} onFinish={handleRegister}>
          <Form.Item
            label={<span style={{ color: '#fff' }}>Họ tên</span>}
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 3, message: 'Họ tên tối thiểu 3 ký tự' },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#fff' }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="email@domain.com" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#fff' }}>Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Ít nhất 6 ký tự" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#fff' }}>Xác nhận mật khẩu</span>}
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
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Button type="primary" block size="large" htmlType="submit">
            Đăng ký
          </Button>

          <div style={{ marginTop: 16, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default RegisterPage;
