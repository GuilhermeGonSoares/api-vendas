import AppError from '@shared/errors/AppError';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

describe('CreateCustomer', () => {
  it('should be able to create a new customer', async () => {
    const fakeRepository = new FakeCustomersRepository();
    const createCustomer = new CreateCustomerService(fakeRepository);

    const customer = await createCustomer.execute({
      name: 'Guilherme',
      email: 'gui@email.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('Guilherme');
    expect(customer.email).toBe('gui@email.com');
  });

  it('should not be able to create a customer with same email', async () => {
    const fakeRepository = new FakeCustomersRepository();
    const createCustomer = new CreateCustomerService(fakeRepository);

    await createCustomer.execute({
      name: 'Guilherme',
      email: 'gui@email.com',
    });

    expect(
      createCustomer.execute({
        name: 'Guilherme2',
        email: 'gui@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
