import { FC, useEffect, useState } from 'react';
import cls from 'classnames';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCategories } from '../../store/categoriesSlice';
import {
  deleteProduct,
  fetchProductByCategory,
} from '../../store/productSlice';
import Loader from '../Loader';
import editIcon from '../../assets/icons/edit-svgrepo-com.svg';
import trashIcon from '../../assets/icons/trash-svgrepo-com.svg';
import styles from './Home.module.scss';
import { routes } from '../../utils/routes';

const Home: FC = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('');

  const { categoryList, loading: categoryLoading } = useAppSelector(
    (state) => state.category
  );

  const { products, loading: productLoading } = useAppSelector(
    (state) => state.product
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (activeCategory) dispatch(fetchProductByCategory(activeCategory));
  }, [dispatch, activeCategory]);

  useEffect(() => {
    if (categoryList?.length && categoryList?.[0]._id)
      setActiveCategory(categoryList?.[0]._id);
  }, [categoryList]);

  useEffect(() => {
    if (activeCategory) dispatch(fetchProductByCategory(activeCategory));
  }, [dispatch, activeCategory]);

  const handleClickCategory = (id: string): void => {
    setActiveCategory(id);
  };

  const handleEditProduct = (id: string): void => {
    const editingProduct = products.find((product) => product._id === id);
    navigate(routes.addNew, { state: { editingProduct } });
  };

  const handleRemoveProduct = (id: string): void => {
    if (id) dispatch(deleteProduct(id));
  };

  if (categoryLoading) return <Loader size="small" />;

  if (!categoryList?.length)
    return <h2 className={styles.emptyState}>Not found categories</h2>;

  return (
    <div className={styles.home_wrapper}>
      <div className={styles.categoryList_wrapper}>
        {!!categoryList?.length &&
          categoryList.map((category) => (
            <div
              key={category._id}
              onClick={() => category._id && handleClickCategory(category._id)}
              className={cls(styles.category_item, {
                [styles.active]: category._id === activeCategory,
              })}
            >
              {category.name}
            </div>
          ))}
      </div>
      <div className={styles.products_wrapper}>
        {productLoading ? (
          <Loader />
        ) : (
          !!products?.length &&
          products.map((product) => (
            <div key={product._id} className={styles.product_wrapper}>
              <div className={styles.product_overlay_wrapper}>
                <div
                  onClick={() => product._id && handleEditProduct(product._id)}
                  className={styles.icon_wrapper}
                >
                  <img className={styles.icon} src={editIcon} alt="edit" />
                </div>
                <div
                  onClick={() =>
                    product._id && handleRemoveProduct(product._id)
                  }
                  className={styles.icon_wrapper}
                >
                  <img className={styles.icon} src={trashIcon} alt="remove" />
                </div>
              </div>
              <div className={styles.product_name}>{product.name}</div>
              <div className={styles.product_price}>{product.price}</div>
            </div>
          ))
        )}
        {activeCategory && !products.length && !productLoading && (
          <p className={styles.not_found}>
            Not found products for selected category
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
