import React from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart?.(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  // Safely format price
  const formatPrice = (price: any) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div className="card">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 flex-grow">{product.description}</p>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">${formatPrice(product.price)}</span>
            <span className={`text-sm ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`mt-3 w-full btn ${product.stock <= 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
