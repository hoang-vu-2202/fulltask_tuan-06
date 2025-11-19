import { Col, Flex, Row, Typography } from 'antd';
import './AuthLayout.css';

const { Title, Paragraph, Text } = Typography;

const featureList = [
  'Bảo mật nhiều lớp với JWT + Rate limiting',
  'Quản lý người dùng với vai trò User/Admin',
  'Quên mật khẩu bằng mã token an toàn',
];

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <Flex vertical gap={16}>
              <Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
                MySQL Auth Portal
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
                Đăng nhập để sử dụng các API bảo mật với Register, Login, Forgot Password.
              </Paragraph>
              <div className="feature-list">
                {featureList.map((item) => (
                  <Flex key={item} align="center" gap={12} className="feature-item">
                    <span className="dot" />
                    <Text>{item}</Text>
                  </Flex>
                ))}
              </div>
            </Flex>
          </Col>
          <Col xs={24} md={12}>
            <div className="form-container">{children}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AuthLayout;
