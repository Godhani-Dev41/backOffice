export enum AddonRelationType {
  CHILD = "child",
  UPSALE = "upsale",
}
export interface AddOnsData {
  relationType: AddonRelationType;
  isPublic: boolean;
  amountInPackage: number;
  name: string;
  resourcesIdsToApplyOn: number[];
  price: number;
}

export interface ProductPrice {
  id: number;
  createdAt: string;
  updatedAt: string;
  organizationId: number;
  productId: number;
  name: string;
  price: number;
  currency: string;
  paymentProcessorId: string;
  startDate: string;
  endDate: string;
}

export interface Product {
  id: number;
  organizationId?: number;
  name: string;
  quantity?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  prices?: ProductPrice[];
  currPrice: ProductPrice;
  downpayment?: number;
}

export interface ProductPackageChild {
  product: Product;
  relationType: AddonRelationType;
}

// the children of a product
export interface ProductPackage {
  parentProduct: Product;
  children: ProductPackageChild[];
}

export interface CreateProductsDto {
  products: CreateProductDto[];
  addOnsData?: AddOnsData[];
}

export interface CreateProductDto {
  id?: number;
  organizationId: number;
  name: string;
  description: string;
  quantity: number;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  productType: string;
  resourcesType?: string;
  resourcesIdsToApplyOn?: number[];
  prices: CreatePricingDto[];
  downpayment?: number;
}

export interface CreatePricingDto {
  id?: number;
  price: number;
  currency: string;
  name: string;
  startDate: string;
  endDate: string;
}
