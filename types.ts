// Domain Entities

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export enum CheckoutStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// API Response Wrappers (Simulating PHP backend responses)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}