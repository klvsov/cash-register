export interface ICategory {
  name: string;
  _id?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  code: string;
  price: number;
  category: string;
  count?: number;
}

export interface INewObject {
  name: string;
  _id?: string;
  code?: string;
  price?: number;
  category?: string;
}
