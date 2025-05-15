export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number; // Changed from stockQuantity to match API
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  orderDate?: string; // Added to match API
  items?: OrderItem[]; // NestJS may return as items
  orderItems?: OrderItem[]; // Legacy field for backward compatibility
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
