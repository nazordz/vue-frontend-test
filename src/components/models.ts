export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  birth_date: string
  gender: string
  created_at: string
  updated_at: string
}

export interface CategoryProduct {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  stock: number
  category_product_id: string
  category_product: CategoryProduct
  created_at: string
  updated_at: string
}

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export enum TypeTransaction {
  IN = 'IN',
  OUT = 'OUT'
}

export interface Transaction {
  id: string
  type: TypeTransaction,
  transaction_products?: TransactionProduct
  user_id: number
  user?: User
  created_at: string
  updated_at: string
}

export interface SelectOption {
  value: string | number
  label: string
}

export interface TransactionProduct {
  id: string
  transaction_id: string
  transaction?: Transaction
  product_id: string
  product?: Product
  created_at: string
  updated_at: string
}
