import { FC, useEffect, useState } from 'react';

import Scanner from '../Scanner';
import { fetchProductByCode, clearProduct } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styles from './Buy.module.scss';
import { IProduct } from '../../types';
import Loader from '../Loader';

const Buy: FC = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.product);

  const [productList, setProductList] = useState<IProduct[]>([]);
  const [scan, setScan] = useState(true);
  // const [code, setCode] = useState('');
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (product) {
      setProductList([...productList, { ...product, count: 1 }]);
    }
    dispatch(clearProduct());
  }, [product, dispatch, productList]);

  // useEffect(() => {
  //   if (code) {
  //     dispatch(fetchProductByCode(code));
  //   }
  //   setCode('');
  // }, [code, dispatch]);

  useEffect(() => {
    let sum = 0;
    productList.forEach((product) => {
      if (product.count) sum += product.price * product.count;
    });
    setSum(sum);
  }, [productList]);

  useEffect(() => {
    if (!scan) setTimeout(() => setScan(true), 5000);
  }, [scan]);

  const onDetected = (result: string) => {
    // setCode(result);
    setScan(false);
    dispatch(fetchProductByCode(result));
  };

  const handleChangeCount = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { value } = e.target;
    const products = [...productList];
    products[i].count = Number(value);
    setProductList(products);
  };

  return (
    <div className={styles.buy_wrapper}>
      <div className={styles.scanner_box}>
        {scan ? (
          <div className={styles.scanner_wrapper}>
            <div className={styles.diode}>
              <div className={styles.laser} />
            </div>
            <Scanner onDetected={onDetected} />
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <div className={styles.product_list}>
        {!!productList?.length ? (
          productList.map((product, i) => (
            <div className={styles.product_item_wrapper} key={product._id}>
              <div className={styles.product_name}>{product.name}</div>
              <div className={styles.product_price}>{product.price}</div>
              <input
                type="number"
                min={1}
                value={product.count}
                onChange={(e) => handleChangeCount(e, i)}
              />
            </div>
          ))
        ) : (
          <p className={styles.no_product}>Please scan the barcode</p>
        )}
        <p className={styles.summary}>Summary: {sum} UAH</p>
      </div>
    </div>
  );
};

export default Buy;
