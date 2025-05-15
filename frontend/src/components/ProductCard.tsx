import React from 'react';
import { Product } from '../types';
import { addToCart } from '../utils/cartStorage';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className="card">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 flex-grow">{product.description}</p>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <span className={`text-sm ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`mt-3 w-full btn ${
              product.stock > 0 ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
