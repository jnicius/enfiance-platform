import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        className="auth-input password-input"
        type={
          showPassword
            ? 'text'
            : 'password'
        }
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required={required}
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );
}
