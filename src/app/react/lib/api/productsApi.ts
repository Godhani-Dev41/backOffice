import { CreateProductsDto } from './../../types/product';
import { network } from './../network';
import { environment } from 'environments/environment';
const productAPIUrl = `${environment.CS_URLS.API_ROOT_V3}/productPricing`;

async function createProducts(createProductsData: CreateProductsDto) : Promise<any> {
  // const { headers } = auth.getAuthHeaders();

  const response = await network.post(
    `${productAPIUrl}/products`,
    createProductsData,
    //headers
  );

  return response;
}

export const productApi = { 
  createProducts,
};
