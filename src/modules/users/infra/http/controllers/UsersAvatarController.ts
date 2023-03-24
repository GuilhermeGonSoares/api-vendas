import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

export default class UsersAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateAvatar = new UpdateUserAvatarService();
    const user = await updateAvatar.execute({
      userId: req.user.id,
      avatarFilename: req.file?.filename as string,
    });

    return res.json(instanceToInstance(user));
  }
}
