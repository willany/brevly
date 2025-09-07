import React from 'react';

import DownloadIcon from '../assets/Download.png';
import LinkIcon from '../assets/Link.png';
import { useDownloadCSV } from '../hooks/useDownloadCSV';
import { useLinks } from '../hooks/useLinks';

import { IconButton } from './IconButton';
import { LinkCard } from './LinkCard';
import styles from './LinksList.module.css';

export const LinksList: React.FC = () => {
  const { data: links, isLoading, isFetching } = useLinks();
  const downloadCSVMutation = useDownloadCSV();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.contentContainer}>
          <div className={styles.loadingContainer}>
            <span className={styles.loader}></span>
            <p className={styles.loadingText}>Carregando links...</p>
          </div>
        </div>
      );
    }

    if (!links || links.length === 0) {
      return (
        <div className={styles.contentContainer}>
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateIcon}>
              <img src={LinkIcon} alt='link' />
            </div>
            <h3 className={styles.emptyStateTitle}>
              Ainda não existem links cadastrados
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.contentContainer}>
        <div className={styles.linksContainer}>
          {links.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
        {isFetching && !isLoading && (
          <div className={styles.refetchIndicator}>
            <span className={styles.smallLoader}></span>
            <span>Atualizando...</span>
          </div>
        )}
      </div>
    );
  };

  const isDisabled =
    downloadCSVMutation.isPending || isLoading || !links || links.length === 0;
  return (
    <div
      className={`${styles.card} ${styles.linksListCard} ${isFetching ? styles.loading : ''}`}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Meus links</h2>
        <IconButton
          size='sm'
          onClick={() => downloadCSVMutation.mutate()}
          icon={DownloadIcon}
          disabled={isDisabled}
        >
          {downloadCSVMutation.isPending ? 'Baixando...' : 'Baixar CSV'}
        </IconButton>
      </div>

      {renderContent()}
    </div>
  );
};
