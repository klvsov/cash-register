import { FC, useEffect, useRef, useState } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';

import Scanner from '../Scanner';
import { fetchProductByCode, clearProduct } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styles from './Buy.module.scss';
import { IProduct } from '../../types';
import Loader from '../Loader';

const sound = require('../../assets/Barcode-scanner-beep-sound.mp3');

const Buy: FC = () => {
  const pdfExportComponent = useRef<PDFExport>(null);

  const audio = new Audio(sound);

  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.product);

  const [productList, setProductList] = useState<IProduct[]>([]);
  const [scan, setScan] = useState(true);
  const [code, setCode] = useState('');
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (product) {
      setProductList([...productList, { ...product, count: 1 }]);
    }
    dispatch(clearProduct());
  }, [product, dispatch, productList]);

  useEffect(() => {
    code && dispatch(fetchProductByCode(code));
  }, [code, dispatch]);

  useEffect(() => {
    let sum = 0;
    productList.forEach((product) => {
      if (product.count) sum += product.price * product.count;
    });
    setSum(sum);
  }, [productList]);

  useEffect(() => {
    if (!scan) setTimeout(() => setScan(true), 3000);
  }, [scan]);

  const onDetected = (result: string) => {
    if (result) {
      setCode(result);
      setScan(false);
      audio.play();
    }
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

  const handlePrint = (): void => {
    pdfExportComponent.current && pdfExportComponent.current.save();
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
        <PDFExport ref={pdfExportComponent} paperSize="A5" margin={25}>
          <div className={styles.products}>
            {!!productList?.length ? (
              productList.map((product, i) => (
                <div
                  className={styles.product_item_wrapper}
                  key={product._id ? product._id + Date.now() : Date.now()}
                >
                  <div className={styles.product_name}>{product.name}</div>
                  <div className={styles.product_price}>
                    {product.price} UAH
                  </div>
                  <input
                    className={styles.product_count}
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
          </div>
          <p className={styles.summary}>Total: {sum} UAH</p>
        </PDFExport>
        <div className={styles.btn_wrapper}>
          <button className={styles.btn_print} onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
