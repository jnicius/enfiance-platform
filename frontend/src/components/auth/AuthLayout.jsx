import '../../styles/auth.css';

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-logo">
          ENFIANCE
        </div>

        <h1 className="auth-title">
          {title}
        </h1>

        {subtitle && (
          <p className="auth-subtitle">
            {subtitle}
          </p>
        )}

        <div className="auth-form">
          {children}
        </div>

        {footer && (
          <div className="auth-footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}
