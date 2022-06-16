import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearCategoryMessage } from '../../store/categoriesSlice';
import { clearProductMessage } from '../../store/productSlice';
import cls from 'classnames';
import styles from './Snackbar.module.scss';

interface SnackbarProps {
  isActive: boolean;
  message: string;
}

const Snackbar: FC<SnackbarProps> = ({ isActive, message }) => {
  const show = isActive;

  const dispatch = useAppDispatch();

  const productMessage = useAppSelector((state) => state.product.message);
  const categoryMessage = useAppSelector((state) => state.category.message);

  useEffect(() => {
    productMessage && !isActive && dispatch(clearProductMessage());
    categoryMessage && !isActive && dispatch(clearCategoryMessage());
  }, [productMessage, categoryMessage, isActive, dispatch]);

  return (
    <div
      className={cls(styles.container, {
        [styles.fadeIn]: show,
        [styles.fadeOut]: !show,
      })}
    >
      <span>{message}</span>
      <button className={styles.btn}>&#x2715;</button>
    </div>
  );
};

export default Snackbar;
