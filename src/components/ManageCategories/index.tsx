import { FC, Fragment, useEffect, useState } from 'react';
import cls from 'classnames';
import trashIcon from '../../assets/icons/trash-svgrepo-com.svg';
import editIcon from '../../assets/icons/edit-svgrepo-com.svg';
import checkIcon from '../../assets/icons/check-svgrepo-com.svg';
import styles from './ManageCategories.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchCategories,
  editCategory,
  clearChangeCategory,
  deleteCategory,
} from '../../store/categoriesSlice';
import Loader from '../Loader';

interface IError {
  categoryName?: string | null;
}

const initialErrorState = {
  categoryName: '',
};

const ManageCategories: FC = () => {
  const { categoryList, loading, changeCategory } = useAppSelector(
    (state) => state.category
  );
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [errors, setErrors] = useState<IError>(initialErrorState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!categoryList?.length) dispatch(fetchCategories());
    dispatch(clearChangeCategory());
  }, [categoryList, dispatch]);

  useEffect(() => {
    if (changeCategory) dispatch(fetchCategories());
  }, [dispatch, changeCategory]);

  const handleEditCategory = (id: string): void => {
    setEditCategoryId(id);
    const selectedCategory = categoryList.find(
      (category) => category._id === id
    );
    if (selectedCategory) setEditCategoryName(selectedCategory.name);
  };

  const handleRemoveCategory = (id: string): void => {
    if (id) dispatch(deleteCategory(id));
  };

  const handleChangeCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = e.target;
    const errorList = { ...errors };
    delete errorList.categoryName;
    setErrors(errorList);
    setEditCategoryName(value);
  };

  const handleSaveCategory = (): void => {
    if (!editCategoryName) {
      return setErrors({ ...errors, categoryName: 'Required field' });
    }
    if (editCategoryName)
      dispatch(editCategory({ name: editCategoryName, _id: editCategoryId }));
    setEditCategoryId('');
    setEditCategoryName('');
  };

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>Available categories</div>
      {loading && <Loader size="small" />}
      <div className={styles.categories_wrapper}>
        {!!categoryList?.length &&
          categoryList.map((category) => (
            <Fragment key={category._id}>
              {editCategoryId && editCategoryId === category._id ? (
                <div
                  className={cls(styles.category_wrapper, styles.edit_wrapper)}
                >
                  <input
                    type="text"
                    name="categoryName"
                    value={editCategoryName}
                    onChange={handleChangeCategory}
                    className={cls({
                      [styles.errorState]: !!errors?.categoryName,
                    })}
                  />
                  <span className={styles.error}>{errors?.categoryName}</span>
                  <button onClick={handleSaveCategory}>
                    <img src={checkIcon} alt="check" />
                  </button>
                </div>
              ) : (
                <div className={styles.category_wrapper}>
                  {category.name}
                  <div className={styles.cashOverlay}>
                    <div
                      onClick={() =>
                        category._id && handleEditCategory(category._id)
                      }
                      className={styles.icon_wrapper}
                    >
                      <img className={styles.icon} src={editIcon} alt="edit" />
                    </div>
                    <div
                      onClick={() =>
                        category._id && handleRemoveCategory(category._id)
                      }
                      className={styles.icon_wrapper}
                    >
                      <img
                        className={styles.icon}
                        src={trashIcon}
                        alt="remove"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default ManageCategories;
