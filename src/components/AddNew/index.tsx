import React, { useEffect, useState } from 'react';
import cls from 'classnames';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ICategory, IProduct } from '../../types';
import styles from './AddNew.module.scss';
import { addProduct, editProduct } from '../../store/productSlice';
import { addCategory, fetchCategories } from '../../store/categoriesSlice';
import Loader from '../Loader';
import Toggler from '../Toggler';
import Scanner from '../Scanner';

const initialState = {
  code: '',
  name: '',
  price: 0,
  category: '',
};

const initialErrorState = {
  code: '',
  name: '',
  price: '',
  category: '',
};

interface IError {
  code?: string | null;
  name?: string | null;
  price?: string | null;
  category?: string | null;
}

interface IState {
  editingProduct: IProduct;
}

const AddNew: React.FC = () => {
  const location = useLocation();
  const state = location?.state as IState;
  const editingProduct = state?.editingProduct;

  const { loading: productLoading } = useAppSelector((state) => state.product);

  const { categoryList } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();

  const [isAddProduct, setIsAddProduct] = useState(true);
  const [scan, setScan] = useState(true);
  const [fields, setFields] = useState<IProduct>(initialState);
  const [errors, setErrors] = useState<IError>(initialErrorState);

  useEffect(() => {
    if (editingProduct) {
      const editValue = {
        code: editingProduct?.code,
        name: editingProduct?.name,
        price: editingProduct?.price,
        category:
          categoryList.find((item) => item._id === editingProduct.category)
            ?.name || '',
      };
      setFields(editValue);
      setIsAddProduct(true);
      setScan(false);
    }
  }, [editingProduct, categoryList]);

  useEffect(() => {
    if (!categoryList?.length) dispatch(fetchCategories());
  }, [categoryList, dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    const errorList = { ...errors };
    if (errorList.hasOwnProperty(name)) delete errorList.name;
    setErrors(errorList);
    setFields({ ...fields, [name]: value });
  };

  const handleChangeSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    const errorList = { ...errors };
    if (errorList.hasOwnProperty(name)) delete errorList.category;
    setErrors(errorList);
    setFields({ ...fields, [name]: value });
  };

  const handleSaveProduct = (): void => {
    const selectCategoryName = categoryList.find(
      (item) => item.name === fields.category
    );
    if (!fields.code) return setErrors({ ...errors, code: 'Code is required' });
    if (!fields.category)
      return setErrors({ ...errors, category: 'Required field' });
    if (!fields.name) return setErrors({ ...errors, name: 'Required field' });
    if (!fields.price) return setErrors({ ...errors, price: 'Required field' });
    if (!Number(fields.price))
      return setErrors({ ...errors, price: 'Not valid' });
    if (fields.price <= 0) return setErrors({ ...errors, price: 'Not valid' });

    const readyData: IProduct = {
      ...fields,
    };
    if (selectCategoryName?.name && selectCategoryName._id)
      readyData.category = selectCategoryName._id;
    readyData?._id
      ? dispatch(editProduct(readyData))
      : dispatch(addProduct(readyData));
    setFields(initialState);
    setScan(true);
  };

  const handleSaveCategory = (): void => {
    if (!fields.name) {
      return setErrors({ ...errors, name: 'Required field' });
    }
    const readyData: ICategory = {
      name: fields.name,
    };

    dispatch(addCategory(readyData));
    setFields(initialState);
  };

  const onDetected = (result: string) => {
    if (result) {
      setFields({ ...fields, code: result });
      setScan(false);
    }
  };
  return (
    <div className={styles.main_wrapper}>
      {productLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.title}>
            Add new {isAddProduct ? 'product' : 'category'}
          </div>

          <div className={styles.toggler_wrapper}>
            <div className={styles.toggle_left_label}>Category</div>
            <Toggler
              isOn={isAddProduct}
              handleToggle={() => setIsAddProduct(!isAddProduct)}
            />
            <div className={styles.toggle_right_label}>Product</div>
          </div>

          <div className={styles.wrapper}>
            {isAddProduct && (
              <>
                {scan ? (
                  <div className={styles.scanner_wrapper}>
                    <div className={styles.diode}>
                      <div className={styles.laser} />
                    </div>
                    <Scanner onDetected={onDetected} />
                    <span className={styles.error}>{errors?.code}</span>
                  </div>
                ) : (
                  <p className={styles.product_code}>Code - {fields.code}</p>
                )}
              </>
            )}

            {isAddProduct && (
              <div className={cls(styles.form_group, styles.field)}>
                <select
                  id="category"
                  name="category"
                  value={fields.category || ''}
                  onChange={handleChangeSelect}
                  className={cls(styles.form_field, {
                    [styles.errorState]: !!errors?.category,
                  })}
                  placeholder="Category"
                  required
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  {categoryList?.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <span className={styles.error}>{errors?.category}</span>
                <label htmlFor="category" className={styles.form_label}>
                  Category
                </label>
              </div>
            )}
            <div className={cls(styles.form_group, styles.field)}>
              <input
                id="name"
                name="name"
                value={fields.name || ''}
                onChange={handleChange}
                type="input"
                className={cls(styles.form_field, {
                  [styles.errorState]: !!errors?.name,
                })}
                placeholder="Name"
                required
              />
              <span className={styles.error}>{errors?.name}</span>
              <label htmlFor="name" className={styles.form_label}>
                {isAddProduct ? 'Name' : 'Category name'}
              </label>
            </div>
            {isAddProduct && (
              <div className={cls(styles.form_group, styles.field)}>
                <input
                  id="price"
                  name="price"
                  value={fields.price || 0}
                  onChange={handleChange}
                  type="input"
                  className={cls(styles.form_field, {
                    [styles.errorState]: !!errors?.price,
                  })}
                  placeholder="Price"
                  required
                />
                <span className={styles.error}>{errors?.price}</span>
                <label htmlFor="price" className={styles.form_label}>
                  Price
                </label>
              </div>
            )}
            <button
              onClick={isAddProduct ? handleSaveProduct : handleSaveCategory}
              className={styles.btn}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNew;
