import { Request, Response, Router } from 'express';
import {
  SessionController,
  UserController
} from './controller/index'

const routes = Router();
const sessionController = new SessionController();
const userController = new UserController();

routes.get('/', (req: Request, res: Response) => {
  return res.json({ msg: 'Hello World' });
});

routes.get('/users', userController.index.bind(userController));
routes.post('/users', userController.store.bind(userController));

routes.post('/sessions', sessionController.store.bind(sessionController));

export default routes;
