import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    variant?: 'default' | 'custom';
}

export const Button: React.FC<ButtonProps> = ({
    children = 'View Details',
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    variant = 'default',
}) => {
    const defaultStyles = variant === 'default'
        ? 'inline-flex justify-center items-center rounded-[14px] px-[23.8px]! py-[12px]! bg-[linear-gradient(60deg,#F094FA_13.4%,#F5576E_86.6%)]'
        : '';

    const disabledStyles = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : '';

    return (
        <button
            type={type}
            className={`${defaultStyles} ${disabledStyles} ${className}`.trim()}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}