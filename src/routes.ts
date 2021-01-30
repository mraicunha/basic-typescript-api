import { Request, Response, Router } from 'express';
import { AuthenticateToken } from './middleware/index';
import {
  SessionController,
  UserController
} from './controller/index';

const routes = Router();
const authenticateToken = new AuthenticateToken();
const sessionController = new SessionController();
const userController = new UserController();

routes.get('/', (req: Request, res: Response) => {
  return res.json({ msg: 'Hello World' });
});

routes.get('/users', authenticateToken.validateToken, userController.index.bind(userController));
routes.post('/users', authenticateToken.validateToken, userController.store.bind(userController));
routes.put('/users', authenticateToken.validateToken, userController.update.bind(userController));
routes.delete('/users/:_id', authenticateToken.validateToken, userController.destroy.bind(userController));

routes.post('/sessions', sessionController.store.bind(sessionController));

export default routes;
