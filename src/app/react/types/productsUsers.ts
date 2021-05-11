export interface ProductsUsers {
  id: number;
  organizationId: number;
  productId: number;
  userId: number;
  user?: any;
  paymentStatus: string; // PaymentStatusEnum;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productPriceCurrency: string; // CurrencyEnum;
}
