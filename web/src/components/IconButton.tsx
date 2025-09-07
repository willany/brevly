import React from 'react';

import styles from './IconButton.module.css';

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClass = styles.iconBtn;
  const sizeClass =
    styles[`iconBtn${size.charAt(0).toUpperCase() + size.slice(1)}`];

  const buttonClasses = [baseClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={`${buttonClasses} ${disabled ? styles.iconBtnDisabled : ''}`}
      disabled={disabled}
      {...props}
    >
      <span className={styles.iconBtnIcon}>
        <img
          src={icon}
          alt='icon'
          className={`${styles.iconBtnIconImage} ${disabled ? styles.iconBtnIconImageDisabled : ''}`}
        />
      </span>
      {children && (
        <span
          className={`${styles.iconBtnText} ${disabled ? styles.iconBtnTextDisabled : ''}`}
        >
          {children}
        </span>
      )}
    </button>
  );
};
