import React from 'react';
import styles from './BentoGrid.module.css';

const BentoGrid = ({ header, sidebar, center, companion }) => {
  return (
    <div className={styles.gridContainer}>
      <header className={styles.headerArea}>
        {header}
      </header>
      
      <aside className={styles.sidebarArea}>
        {sidebar}
      </aside>
      
      <main className={styles.centerArea}>
        {center}
      </main>
      
      <div className={styles.companionArea}>
        {companion}
      </div>
    </div>
  );
};

export default BentoGrid;
