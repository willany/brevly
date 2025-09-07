import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import CopyIcon from '../assets/Copy.png';
import TrashIcon from '../assets/Trash.png';
import { useDeleteLink } from '../hooks/useDeleteLink';
import type { Link } from '../types';

import { IconButton } from './IconButton';
import styles from './LinkCard.module.css';

interface LinkCardProps {
  link: Link;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  const [copied, setCopied] = useState(false);
  const deleteLinkMutation = useDeleteLink();

  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const shortUrl = `${frontendUrl}/${link.shortUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Tem certeza que deseja deletar o link ${link.shortUrl}?`)
    ) {
      try {
        await deleteLinkMutation.mutateAsync(link.id);
      } catch (error) {
        console.error('Failed to delete link:', error);
      }
    }
  };

  useEffect(() => {
    if (copied) {
      Swal.fire({
        title: 'Link copiado',
        text: 'Link copiado para a área de transferência',
        icon: 'success',
        iconColor: 'var(--blue-base)',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  }, [copied]);

  const goToRedirectPage = () => {
    window.open(`/${link.shortUrl}`, '_blank');
  };

  return (
    <div className={styles.linkCard}>
      <div className={styles.linkInfo} onClick={goToRedirectPage}>
        <div className={styles.linkInfoContent}>
          <div className={styles.shortUrl}>{shortUrl}</div>
          <div className={styles.originalUrl}>{link.originalUrl}</div>
        </div>
        <div className={styles.accessCount}>{link.accessCount} acessos</div>
      </div>

      <div className={styles.actions}>
        <IconButton size='sm' onClick={handleCopy} icon={CopyIcon} />
        <IconButton
          size='sm'
          onClick={handleDelete}
          icon={TrashIcon}
          disabled={deleteLinkMutation.isPending}
        />
      </div>
    </div>
  );
};
