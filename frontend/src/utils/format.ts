export const formatPrice = (price: any): string => {
  const num = Number(price);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export const formatCurrency = (price: any): string => {
  return `$${formatPrice(price)}`;
};
