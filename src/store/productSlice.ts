import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { IProduct } from '../types';

const BASE_URL = 'https://warm-refuge-29168.herokuapp.com/api';
// const BASE_URL = 'http://localhost:9000/api';

type ProductsState = {
  products: IProduct[];
  product: IProduct | null;
  loading: boolean;
  error: string | undefined | null;
  changeProduct: null | IProduct;
};

const initialState: ProductsState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  changeProduct: null,
};

export const fetchProductByCategory = createAsyncThunk<
  IProduct[],
  string,
  { rejectValue: { message: string } }
>('products/fetchProductByCategory', async (id) => {
  const response = await fetch(`${BASE_URL}/products/categories/${id}`);
  if (!response.ok) throw new Error('Server error!');
  const data = await response.json();
  return data;
});

export const fetchProductByCode = createAsyncThunk<
  IProduct,
  string,
  { rejectValue: { message: string } }
>('products/fetchProductByCode', async (code) => {
  const response = await fetch(`${BASE_URL}/products/codes/${code}`);
  if (!response.ok) throw new Error('Server error!');
  const data = await response.json();
  return data;
});

export const addProduct = createAsyncThunk<
  IProduct,
  IProduct,
  { rejectValue: string }
>('products/addProduct', async (product) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error("Can't add product. Server error!");
  return (await response.json()) as IProduct;
});

export const editProduct = createAsyncThunk<
  IProduct,
  IProduct,
  { rejectValue: string }
>('products/editProduct', async (product: IProduct) => {
  const readyProduct = {
    name: product.name,
    code: product.code,
    price: product.price,
    category: product.category,
  };
  const response = await fetch(`${BASE_URL}/products/${product._id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(readyProduct),
  });

  if (!response.ok) throw new Error("Can't edit product. Server error!");
  return (await response.json()) as IProduct;
});

export const deleteProduct = createAsyncThunk<
  IProduct,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (id: string) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error("Can't delete category. Server error!");
  return (await response.json()) as IProduct;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearChangeProduct: (state) => {
      state.changeProduct = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductByCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(fetchProductByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProductByCode.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.changeProduct = action.payload;
      })
      .addCase(editProduct.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.changeProduct = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      });
  },
});

export const { clearChangeProduct, clearProduct } = productsSlice.actions;

export default productsSlice.reducer;
