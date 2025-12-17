import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputForm = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef(null); // Ref for the textarea
  
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';
  
  // Determine actual input type (handle password toggle)
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Auto-resize logic for textarea
  useEffect(() => {
    if (isTextarea && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight on shrink
      textareaRef.current.style.height = "auto";
      // Set height to scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isTextarea]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-sm font-bold font-outfit text-txt-primary uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div 
        className={`
          group w-full flex gap-3 py-3 px-4 rounded-xl 
          border transition-all duration-200 
          bg-surface
          ${/* Use items-start for textarea so icon stays at top, items-center for others */
            isTextarea ? 'items-start' : 'items-center'
          }
          ${error 
            ? 'border-red-500 focus-within:ring-red-200' 
            : 'border focus-within:ring-2 focus-within:ring-offset-2 border-txt-dark hover:border-txt-placeholder transition-all duration-200 focus-within:border-txt-placeholder focus-within:outline-none focus-within:ring-border gap-2 py-2 px-6 rounded-lg bg-surface'
          }
        `}
      >
        {/* Left Icon */}
        {Icon && (
          <div className={`
            transition-colors duration-200 
            ${/* Add top margin for textarea icon to align with text */
              isTextarea ? 'mt-1' : ''
            }
            ${error ? 'text-red-400' : 'text-txt-dark group-focus-within:text-txt-accent'}
          `}>
            <Icon size={20} />
          </div>
        )}

        {/* Conditional Rendering: Textarea vs Input */}
        {isTextarea ? (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={1} // Start with 1 row
            className="w-full bg-transparent outline-none font-medium font-roboto text-txt-primary placeholder-txt-placeholder text-base resize-none overflow-hidden"
            {...props}
          />
        ) : (
          <input
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-transparent outline-none font-medium font-roboto text-txt-primary placeholder-txt-placeholder text-base"
            {...props}
          />
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-txt-placeholder hover:text-txt-dark transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-xs font-medium text-red-500 font-roboto ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputForm;