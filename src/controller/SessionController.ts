import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from '../model/User';
import TokenModel from '../model/Token';
import { PasswordUtils } from '../utils/index';
require('dotenv').config();
const { AUTH_SECRET } = process.env;

export class SessionController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const passwordUtils = new PasswordUtils();
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
      }

      const match = await passwordUtils.compareHash(password, user.password);

      if (!match) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
      }

      const newToken = jwt.sign({ id: user.id }, AUTH_SECRET);
      const token = await TokenModel.findOne({ user: user._id });
      if (!token) {
        await TokenModel.create({ token: newToken, user: user._id });
      } else {
        token.token = newToken;
        await TokenModel.findOneAndUpdate({ user: user._id }, token);
      }
      res.cookie('auth',
        newToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'none'
        });

      return res.json({ logged: '1' });
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { user } = req.res.locals;
      await TokenModel.findOneAndRemove({ user });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
}
