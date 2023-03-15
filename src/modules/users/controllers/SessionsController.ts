import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import CreateSessionsService from '../services/CreateSessionsService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const sessionsService = new CreateSessionsService();

    const user = await sessionsService.execute({ email, password });

    return response.status(201).json(instanceToInstance(user));
  }
}
