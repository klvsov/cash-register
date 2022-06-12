import { FC, useEffect, useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

import { fetchProductByCode, clearProduct } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styles from './Buy.module.scss';
import { IProduct } from '../../types';

const Buy: FC = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.product);

  const [id, setId] = useState('');
  const [productList, setProductList] = useState<IProduct[]>([]);

  console.log({ id });

  useEffect(() => {
    if (product) {
      setProductList([...productList, product]);
      dispatch(clearProduct());
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByCode(id));
      setId('');
    }
  }, [id, dispatch]);

  const barcodeScannerComponentHandleUpdate = (error: any, result: any) => {
    if (result) {
      setId(result.text);
    }
  };

  return (
    <div className={styles.buy_wrapper}>
      <div className={styles.scanner_box}>
        <div className={styles.scanner_wrapper}>
          <div className={styles.diode}>
            <div className={styles.laser} />
          </div>
          {!id && (
            <BarcodeScannerComponent
              width={200}
              height={75}
              onUpdate={barcodeScannerComponentHandleUpdate}
            />
          )}
        </div>
      </div>
      <div className={styles.product_list}>
        {!!productList?.length ? (
          productList.map((product) => (
            <div className={styles.product_item_wrapper} key={product._id}>
              <div className={styles.product_name}></div>
              <div className={styles.product_price}></div>
              <input type="number" min={1} />
            </div>
          ))
        ) : (
          <p className={styles.no_product}>Please scan the barcode</p>
        )}
      </div>
    </div>
  );
};

export default Buy;
