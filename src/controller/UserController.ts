import { Request, Response } from 'express';
import UserModel from '../model/User';

export class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.find({});
      return res.json(users)
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          error: 'Usuário já existe',
          msg: 'O usuário que está tentando cadastrar já existe em nossa base de dados'
        })
      }

      await UserModel.create({ name, email, password });
      const users = await UserModel.find({});
      return res.json(users)
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
} 
