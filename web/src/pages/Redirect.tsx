import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import LogIcon from '../assets/Logo.svg';
import { getOriginalUrl } from '../services';

import componentStyles from './Redirect.module.css';

export const Redirect: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    const redirectToOriginalUrl = async () => {
      if (!shortUrl) {
        navigate('/404', { replace: true });
        return;
      }

      hasRedirected.current = true;

      try {
        const response = await getOriginalUrl(shortUrl);
        setOriginalUrl(response.originalUrl);

        setTimeout(() => {
          window.location.href = response.originalUrl;
        }, 3000);
      } catch (error) {
        console.error('Failed to redirect:', error);
        navigate('/404', { replace: true });
      }
    };

    redirectToOriginalUrl();
  }, [shortUrl, navigate]);

  const handleManualRedirect = () => {
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  };

  return (
    <div className={componentStyles.container}>
      <div className={componentStyles.card}>
        <div className={componentStyles.icon}>
          <img src={LogIcon} alt='redirect' />
        </div>

        <h1 className={componentStyles.title}>Redirecionando...</h1>

        <p className={componentStyles.description}>
          O link será aberto automaticamente em alguns instantes.
        </p>

        <p className={componentStyles.fallback}>
          Não foi redirecionado?{' '}
          <button
            className={componentStyles.link}
            onClick={handleManualRedirect}
            disabled={!originalUrl}
          >
            Acesse aqui
          </button>
        </p>
      </div>
    </div>
  );
};
