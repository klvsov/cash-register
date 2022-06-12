import React from 'react';

import styles from './MainContent.module.scss';

interface MainContentProps {
  children: JSX.Element;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return <div className={styles.main_wrapper}>{children}</div>;
};

export default MainContent;
