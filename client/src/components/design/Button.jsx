import { forwardRef } from 'react';

const variants = {
  primary: 'brutal-btn-primary',
  secondary: 'brutal-btn-secondary',
  danger: 'brutal-btn-danger',
  success: 'brutal-btn-success',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;