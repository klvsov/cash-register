import { FC } from 'react';
import cls from 'classnames';
import styles from './Loader.module.scss';

interface LoaderProps {
  size?: 'big' | 'small';
}

const Loader: FC<LoaderProps> = ({ size }) => {
  return (
    <div className={styles.loader_wrapper}>
      <div
        className={cls(styles.loader, {
          [styles.small]: size === 'small',
        })}
      />
    </div>
  );
};

Loader.defaultProps = {
  size: 'big',
};

export default Loader;
