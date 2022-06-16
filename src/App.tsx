import { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { routes } from './utils/routes';
import Loader from './components/Loader';
import MainContent from './layouts/MainContent';
import Sidebar from './layouts/Sidebar';
import Snackbar from './components/Snackbar';

import { useSnackbar } from './components/Snackbar/useSnackbar';
import styles from './App.module.scss';
import { useAppSelector } from './hooks';

const AddNew = lazy(() => import('./components/AddNew'));
const Home = lazy(() => import('./components/Home'));
const ManageCategories = lazy(() => import('./components/ManageCategories'));
const Buy = lazy(() => import('./components/Buy'));

const App: FC = () => {
  const { isActive, openSnackBar } = useSnackbar();
  const productMessage = useAppSelector((state) => state.product.message);
  const categoryMessage = useAppSelector((state) => state.category.message);

  const [textMessage, setTextMessage] = useState('');

  useEffect(() => {
    productMessage && setTextMessage(productMessage);
    categoryMessage && setTextMessage(categoryMessage);
    if (productMessage || categoryMessage) openSnackBar(textMessage);
  }, [productMessage, categoryMessage]);

  return (
    <div className={styles.main_wrapper}>
      <Snackbar isActive={isActive} message={textMessage} />
      <Sidebar />
      <MainContent>
        <Routes>
          <Route
            path={routes.home}
            element={
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path={routes.manageCategories}
            element={
              <Suspense fallback={<Loader />}>
                <ManageCategories />
              </Suspense>
            }
          />
          <Route
            path={routes.addNew}
            element={
              <Suspense fallback={<Loader />}>
                <AddNew />
              </Suspense>
            }
          />
          <Route
            path={routes.buy}
            element={
              <Suspense fallback={<Loader />}>
                <Buy />
              </Suspense>
            }
          />
        </Routes>
      </MainContent>
    </div>
  );
};

export default App;
