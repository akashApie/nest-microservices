export interface OrderCreatedEvent {
  id: string;
  customerId: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
  items: OrderItemEvent[];
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

export interface CustomerVerificationEvent {
  customerId: string;
  exists: boolean;
}
