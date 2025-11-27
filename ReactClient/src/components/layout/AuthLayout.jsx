import './AuthLayout.css';

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-wrapper">
            <div className="form-container">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
