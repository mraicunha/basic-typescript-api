import { Request, Response } from 'express';
import UserModel from '../model/User';

export class SessionController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      return res.json({ user: 'Mrai', profile: 'ROOT' })
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
} 
