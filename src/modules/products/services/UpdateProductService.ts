import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductRepository';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    if (name !== product.name) {
      const productExists = await productsRepository.findByName(name);
      if (productExists) {
        throw new AppError('There is already product with this name');
      }
    }

    const redisCache = new RedisCache();
    redisCache.invalidate('api-vendas-PRODUCT_LIST');

    product.updateProduct(name, price, quantity);
    productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
