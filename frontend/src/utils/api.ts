import axios, { AxiosError } from 'axios';
import { Product, Customer, Order, CartItem } from '../types';
import toast from 'react-hot-toast';

const CUSTOMER_API_URL = 'http://localhost:3001';
const PRODUCT_API_URL = 'http://localhost:3002';

// Create Axios instances with default config
const customerApi = axios.create({
  baseURL: CUSTOMER_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productApi = axios.create({
  baseURL: PRODUCT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{message?: string}>;
    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  console.error('Unexpected error:', error);
  toast.error('An unexpected error occurred');
  throw error;
};

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('[API] Fetching products from', productApi.defaults.baseURL);
    const response = await productApi.get('/products');
    console.log('[API] Products response:', response);
    return response.data;
  } catch (error) {
    console.error('[API] Products fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('[API] Product fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

// Customers API
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await customerApi.get('/customers');
    return response.data;
  } catch (error) {
    console.error('[API] Customers fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const fetchCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await customerApi.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('[API] Customer fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const createCustomer = async (
  customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'orderIds'>
): Promise<Customer> => {
  try {
    const response = await customerApi.post('/customers', customer);
    return response.data;
  } catch (error) {
    console.error('[API] Customer creation failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

// Orders API
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await productApi.get('/orders');
    return response.data;
  } catch (error) {
    console.error('[API] Orders fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const fetchOrdersByCustomerId = async (customerId: string): Promise<Order[]> => {
  try {
    const response = await productApi.get(`/orders/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('[API] Orders fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await productApi.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('[API] Order fetch failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};

export const createOrder = async (customerId: string, items: CartItem[]): Promise<Order> => {
  try {
    // Transform cart items to order items
    const orderItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    }));

    const response = await productApi.post('/orders', {
      customerId,
      items: orderItems,
      status: 'pending'
    });
    
    return response.data;
  } catch (error) {
    console.error('[API] Order creation failed:', {
      error: error as Error,
      config: (error as AxiosError).config,
      response: (error as AxiosError).response?.data
    });
    return handleApiError(error);
  }
};
