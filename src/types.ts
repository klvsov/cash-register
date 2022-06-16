export interface ICategory {
  name: string;
  _id?: string;
  data?: {
    _id?: string;
  };
}

export interface IProduct {
  _id?: string;
  name: string;
  code: string;
  price: number;
  category: string;
  count?: number;
  data?: {
    _id?: string;
  };
}
