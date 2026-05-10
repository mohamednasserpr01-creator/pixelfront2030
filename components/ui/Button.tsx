// FILE: components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import { FaSpinner } from 'react-icons/fa';
import './ui.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    icon, 
    className = '', 
    fullWidth = false,
    disabled, 
    ...props 
}) => {
    return (
        <button 
            className={`pixel-btn pixel-btn-${variant} pixel-btn-${size} ${isLoading ? 'pixel-btn-loading' : ''} ${className}`} 
            style={{ width: fullWidth ? '100%' : 'auto' }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <FaSpinner className="spinner-icon" /> : icon}
            {children}
        </button>
    );
};