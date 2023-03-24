import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { v4 as uuidv4 } from 'uuid';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

class FakeCustomersRepository implements ICustomersRepository {
  public customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = new Customer();
    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: ICustomer): Promise<ICustomer> {
    this.customers.push(customer);

    return customer;
  }

  public async remove(customer: Customer): Promise<void> {
    const pos = this.customers.indexOf(customer);
    this.customers.splice(pos, 1);
  }

  public async findAll(): Promise<Customer[] | undefined> {
    return this.customers;
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.name === name);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.id === id);
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.email === email);
  }
}

export default FakeCustomersRepository;
