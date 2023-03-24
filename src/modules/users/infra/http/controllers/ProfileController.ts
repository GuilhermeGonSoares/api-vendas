import { Request, Response } from 'express';
import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';
import { instanceToInstance } from 'class-transformer';

export class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const showUser = new ShowProfileService();

    const user = await showUser.execute({ id });

    return response.json(instanceToInstance(user));
  }

  public async update(request: Request, response: Response) {
    const { id } = request.user;
    const { name, email, password, old_password } = request.body;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(instanceToInstance(user));
  }
}
