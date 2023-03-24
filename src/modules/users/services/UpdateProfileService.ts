import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  id: string;
  email: string;
  name: string;
  password?: string;
  old_password?: string;
}

export default class UpdateProfileService {
  public async execute({ id, email, password, name, old_password }: IRequest) {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.email !== email) {
      const emailExists = await userRepository.findByEmail(email);
      if (emailExists) {
        throw new AppError('Email already exists.');
      }
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.');
    }

    if (password && old_password) {
      const passwordConfirmation = await compare(old_password, user.password);

      if (!passwordConfirmation) {
        throw new AppError('Password invalid.');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    userRepository.save(user);

    return user;
  }
}
