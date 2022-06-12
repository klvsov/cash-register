import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cls from 'classnames';

import { routes } from '../../utils/routes';
import styles from './Sidebar.module.scss';
import { ReactComponent as HomeIcon } from '../../assets/icons/home-svgrepo-com.svg';
import { ReactComponent as CategoriesIcon } from '../../assets/icons/collapse-categories-svgrepo-com.svg';
import { ReactComponent as AddIcon } from '../../assets/icons/task-list-add-svgrepo-com.svg';
import { ReactComponent as LogoIcon } from '../../assets/icons/cash-svgrepo-com.svg';
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-svgrepo-com.svg';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const handleClickRoute = (route: string): void => {
    navigate(route);
  };

  return (
    <div className={styles.sidebar_wrapper}>
      <div className={styles.logo_wrapper}>
        <LogoIcon onClick={() => navigate(routes.home)} />
      </div>
      <div className={styles.middle_section}>
        <span
          className={cls({
            [styles.active]: location.pathname === routes.home,
          })}
        >
          <HomeIcon onClick={() => handleClickRoute(routes.home)} />
        </span>
        <span
          className={cls({
            [styles.active]: location.pathname === routes.manageCategories,
          })}
        >
          <CategoriesIcon
            onClick={() => handleClickRoute(routes.manageCategories)}
          />
        </span>
        <span
          className={cls({
            [styles.active]: location.pathname === routes.addNew,
          })}
        >
          <AddIcon onClick={() => handleClickRoute(routes.addNew)} />
        </span>
        <span
          className={cls({
            [styles.active]: location.pathname === routes.buy,
          })}
        >
          <BuyIcon onClick={() => handleClickRoute(routes.buy)} />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
