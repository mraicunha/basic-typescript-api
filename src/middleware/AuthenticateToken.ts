import { Request, Response, NextFunction } from 'express';
import UserModel from '../model/User';
import TokenModel from '../model/Token';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();
const { AUTH_SECRET } = process.env;

export class AuthenticateToken {
  public async validateToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { auth } = req.cookies;
      if (!auth) {
        return res.sendStatus(401);
      } else {
        const decode = jwt.verify(auth, AUTH_SECRET);
        const user = await UserModel.findById({ _id: decode.id });
        if (!user) {
          return res.sendStatus(401);
        } else {
          const token = await TokenModel.findOne({ user: user._id });
          if (!token) {
            return res.sendStatus(401);
          } else {
            if (token.token === auth) {
              res.locals.user = user._id;
              next();
            } else {
              return res.sendStatus(401);
            }
          }
        }
      }
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}
