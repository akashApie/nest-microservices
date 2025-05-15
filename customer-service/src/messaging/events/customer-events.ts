export interface CustomerCreatedEvent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CustomerUpdatedEvent {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerDeletedEvent {
  id: string;
}

export interface OrderAddedToCustomerEvent {
  customerId: string;
  orderId: string;
}

// Order events interfaces for Customer service
export interface OrderCreatedEvent {
  id: string;
  customerId: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
  items?: OrderItemEvent[];
}

export interface OrderItemEvent {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderUpdatedEvent {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
}

export interface OrderCancelledEvent {
  id: string;
  customerId: string;
}

export const CUSTOMER_EVENTS = {
  CUSTOMER_CREATED: 'customer_created',
  CUSTOMER_UPDATED: 'customer_updated',
  CUSTOMER_DELETED: 'customer_deleted',
  ORDER_ADDED_TO_CUSTOMER: 'order_added_to_customer',
  CHECK_CUSTOMER_EXISTS: 'check_customer_exists'
};

export const ORDER_EVENTS = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_CANCELLED: 'order_cancelled'
};
