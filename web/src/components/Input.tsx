import React from 'react';

import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.formLabel}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.formInput} ${error ? styles.formInputError : ''} ${className}`}
        {...props}
      />
      {error && (
        <div className={styles.formError}>
          <span className={styles.errorIcon}>⚠</span>
          <span className={styles.errorMessage}>{error}</span>
        </div>
      )}
    </div>
  );
};
