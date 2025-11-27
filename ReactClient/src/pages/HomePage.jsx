import { Typography } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <div style={{ padding: '40px 0' }}>
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '16px',
                    padding: '48px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <ShoppingOutlined style={{ fontSize: 64, color: '#667eea', marginBottom: 24 }} />
                <Title level={2}>Chào mừng đến với FullTask!</Title>
            </div>
        </div>
    );
};

export default HomePage;
