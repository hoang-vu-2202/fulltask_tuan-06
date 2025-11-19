import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi, resetPasswordApi } from '../services/authApi';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  const handleRequestToken = async (values) => {
    try {
      const res = await forgotPasswordApi({ email: values.email });
      if (res?.success) {
        setEmail(values.email);
        setResetToken(res.token);
        setStep(2);
        message.success('Token đã được tạo, kiểm tra email (hoặc xem response demo).');
      } else {
        message.error(res?.message || 'Không thể gửi yêu cầu');
      }
    } catch (error) {
      message.error(error?.message || 'Lỗi gửi yêu cầu');
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const payload = {
        email,
        token: values.token,
        newPassword: values.newPassword,
      };
      const res = await resetPasswordApi(payload);
      if (res?.success) {
        message.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
        navigate('/login');
      } else {
        message.error(res?.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (error) {
      message.error(error?.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div>
      <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
        {step === 1 ? 'Quên mật khẩu' : 'Nhập mã reset'}
      </Title>
      <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
        {step === 1
          ? 'Nhập email để nhận token đặt lại mật khẩu.'
          : 'Nhập token bạn nhận được và mật khẩu mới.'}
      </Text>

      {step === 1 && (
        <Form
          layout="vertical"
          form={form}
          style={{ marginTop: 24 }}
          requiredMark={false}
          onFinish={handleRequestToken}
        >
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

          <Button type="primary" block size="large" htmlType="submit">
            Gửi token
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form
          layout="vertical"
          form={form}
          style={{ marginTop: 24 }}
          requiredMark={false}
          onFinish={handleResetPassword}
          initialValues={{ token: resetToken }}
        >
          <Form.Item
            label={<span style={{ color: '#fff' }}>Token</span>}
            name="token"
            rules={[{ required: true, message: 'Vui lòng nhập token' }]}
          >
            <Input size="large" prefix={<LockOutlined />} placeholder="Nhập token" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#fff' }}>Mật khẩu mới</span>}
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
          </Form.Item>

          <Button type="primary" block size="large" htmlType="submit">
            Đặt lại mật khẩu
          </Button>
        </Form>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
