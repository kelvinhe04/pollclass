import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="brutal-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        className={`brutal-input ${error ? 'border-red-600' : ''}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1 font-bold">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;