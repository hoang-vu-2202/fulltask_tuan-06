import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MainLayout.css';

const { Header, Content } = Layout;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: user?.name || 'User',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    const navItems = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
        },
        {
            key: '/products',
            icon: <SearchOutlined />,
            label: 'Tìm kiếm sản phẩm',
        },
    ];

    const selectedKey = navItems.find((item) => location.pathname.startsWith(item.key))?.key || '/home';

    return (
        <Layout className="main-layout">
            <Header className="main-header">
                <div className="header-content">
                    <div className="logo-section">
                        <ShoppingOutlined className="logo-icon" />
                        <span className="logo-text">FullTask</span>
                    </div>

                    <Menu
                        mode="horizontal"
                        selectedKeys={[selectedKey]}
                        items={navItems}
                        className="nav-menu"
                        onClick={({ key }) => navigate(key)}
                    />

                    <div className="user-section">
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button type="text" className="user-button">
                                <Space>
                                    <Avatar icon={<UserOutlined />} size="small" />
                                    <span className="user-name">{user?.name || 'User'}</span>
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </Header>

            <Content className="main-content">
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default MainLayout;
