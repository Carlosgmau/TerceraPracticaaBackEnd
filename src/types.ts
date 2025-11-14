import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

export interface Product {
  _id?: ObjectId;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt?: Date;
}

export interface CartItem {
  productId: ObjectId;
  quantity: number;
}

export interface Cart {
  _id?: ObjectId;
  userId: ObjectId;
  items: CartItem[];
}


