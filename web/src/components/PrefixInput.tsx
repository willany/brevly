import React from 'react';

import styles from './PrefixInput.module.css';

interface PrefixInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label?: string;
  error?: string;
  prefix: string;
}

export const PrefixInput: React.FC<PrefixInputProps> = ({
  label,
  error,
  prefix,
  className = '',
  id,
  value,
  onChange,
  ...props
}) => {
  const inputId =
    id || `prefix-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.formLabel}>
          {label}
        </label>
      )}
      <div
        className={`${styles.prefixContainer} ${error ? styles.prefixContainerError : ''} ${className}`}
      >
        <span className={styles.prefix}>{prefix}</span>
        <input
          id={inputId}
          className={styles.prefixInput}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && (
        <div className={styles.formError}>
          <span className={styles.errorIcon}>⚠</span>
          <span className={styles.errorMessage}>{error}</span>
        </div>
      )}
    </div>
  );
};
