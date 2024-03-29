import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ICategory } from '../types';

const BASE_URL = 'https://warm-refuge-29168.herokuapp.com/api';

type CategoriesState = {
  categoryList: ICategory[];
  loading: boolean;
  error: string | undefined | null;
  message: string | null;
};

const initialState: CategoriesState = {
  categoryList: [],
  loading: false,
  error: null,
  message: null,
};

export const fetchCategories = createAsyncThunk<
  ICategory[],
  undefined,
  { rejectValue: { message: string } }
>('categories/fetchCategories', async (_) => {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Server error!');
  const data = await response.json();
  return data;
});

export const addCategory = createAsyncThunk<
  ICategory,
  ICategory,
  { rejectValue: string }
>('categories/addCategory', async (category: ICategory) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) throw new Error("Can't add category. Server error!");
  return (await response.json()) as ICategory;
});

export const editCategory = createAsyncThunk<
  ICategory,
  ICategory,
  { rejectValue: string }
>('categories/editCategory', async (category: ICategory) => {
  const response = await fetch(`${BASE_URL}/categories/${category._id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: category.name }),
  });

  if (!response.ok) throw new Error("Can't edit category. Server error!");
  return (await response.json()) as ICategory;
});

export const deleteCategory = createAsyncThunk<
  ICategory,
  string,
  { rejectValue: string }
>('categories/deleteCategory', async (id: string) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error("Can't delete category. Server error!");
  return (await response.json()) as ICategory;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categoryList = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categoryList.push(action.payload);
        state.message = 'Successfully added category';
      })
      .addCase(addCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categoryList = action.payload?.data?._id
          ? [
              ...state.categoryList.filter(
                (category) => category._id !== action.payload?.data?._id
              ),
              action.payload,
            ]
          : state.categoryList;
        state.message = 'Successfully edited category';
      })
      .addCase(editCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categoryList = action.payload.data?._id
          ? state.categoryList.filter(
              (category) => category._id !== action.payload.data?._id
            )
          : state.categoryList;
        state.message = 'Successfully deleted category';
      })
      .addCase(deleteCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      });
  },
});

export const { clearCategoryMessage } = categoriesSlice.actions;

export default categoriesSlice.reducer;
