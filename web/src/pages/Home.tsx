import React from 'react';

import Logo from '../assets/Logo.svg';
import { LinkForm } from '../components/LinkForm';
import { LinksList } from '../components/LinksList';

import styles from './Home.module.css';

export const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt='brev.ly' className={styles.logoImage} />
        </div>
        <div className={styles.contentContainer}>
          <LinkForm />
          <LinksList />
        </div>
      </div>
    </div>
  );
};
