import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { OrderRepository } from '../typeorm/repositories/OrderRepository';

interface ISerializedProducts {
  product_id: string;
  price: number;
  quantity: number;
}

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest) {
    const ordersRepository = getCustomRepository(OrderRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0]}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const updatedProductQuantity = existsProducts.map(product => ({
      id: product.id,
      quantity:
        product.quantity -
        products.filter(p => p.id === product.id)[0].quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    const serializedProduct: ISerializedProducts[] = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProduct,
    });

    return order;
  }
}

export default CreateOrderService;
