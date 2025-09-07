import React from 'react';

import NotFoundIcon from '../assets/NotFoundIcon.png';
import styles from '../styles/global.module.css';

import componentStyles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  const goToHome = () => {
    window.location.href = '/';
  };
  return (
    <div className={componentStyles.container}>
      <div className={componentStyles.card}>
        <img src={NotFoundIcon} alt='brev.ly' className={styles.logoImage} />
        <h1 className={`${styles['text-xl']} ${componentStyles.title}`}>
          Link não encontrado
        </h1>
        <p className={`${styles['text-md']} ${componentStyles.description}`}>
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <span className={componentStyles.link} onClick={goToHome}>
            brev.ly
          </span>
          .
        </p>
      </div>
    </div>
  );
};
