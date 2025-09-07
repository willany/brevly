import React from 'react';

import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = styles.btn;
  const variantClass =
    styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const sizeClass =
    styles[`btn${size.charAt(0).toUpperCase() + size.slice(1)}`];
  const loadingClass = loading ? styles.btnLoading : '';
  const disabledClass = disabled ? styles.btnDisabled : '';

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
};
