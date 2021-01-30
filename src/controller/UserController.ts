import { Request, Response } from 'express';
import UserModel from '../model/User';
import { PasswordUtils } from '../utils/index';

export class UserController {

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.find({});
      users.sort((a, b) => (a.email > b.email) ? 1 : -1);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const passwordUtils = new PasswordUtils();
      const { name, email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          error: {
            error: 'Usuário já existe',
            msg: 'O usuário que deseja cadastrar já existe cadastrado em nossa base de dados.'
          }
        });
      }
      const hash = await passwordUtils.generateHash(password);

      await UserModel.create({
        name,
        email,
        password: hash,
        createAt: new Date(),
      });
      const users = await UserModel.find({});

      users.sort((a, b) => (a.email > b.email) ? 1 : -1);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }


  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const passwordUtils = new PasswordUtils();
      const { user } = req.body;
      Object.entries(user).forEach(entry => {
        const [key, value] = entry;
        if (!value) {
          delete user[key];
        }
      });
      if (user.password) {
        user.password = await passwordUtils.generateHash(user.password);
      }
      const userUpdate = await UserModel.findByIdAndUpdate({ _id: user._id }, user);

      if (!userUpdate) {
        return res.status(400).json({
          error: {
            error: 'Usuário não encontrado',
            msg: 'O usuário que deseja atualizar não foi encontrado. Por favor, atualize a página e tente novamente.'
          }
        });
      }
      const users = await UserModel.find({});
      users.sort((a, b) => (a.email > b.email) ? 1 : -1);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }


  public async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.params;
      const user = await UserModel.findById(_id);
      if (!user) {
        return res.status(400).json({
          error: {
            error: 'Usuário não encontrado',
            msg: 'O usuário que deseja remover não foi encontrado. Por favor, atualize a página e tente novamente.'
          }
        });
      }
      await UserModel.findByIdAndRemove(_id);
      const users = await UserModel.find({});
      users.sort((a, b) => (a.email > b.email) ? 1 : -1);
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
}
