"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./middleware/index");
const index_2 = require("./controller/index");
const routes = express_1.Router();
const authenticateToken = new index_1.AuthenticateToken();
const sessionController = new index_2.SessionController();
const userController = new index_2.UserController();
routes.get('/', (req, res) => {
    return res.json({ msg: 'Hello World' });
});
routes.get('/users', authenticateToken.validateToken, userController.index.bind(userController));
routes.post('/users', authenticateToken.validateToken, userController.store.bind(userController));
routes.put('/users', authenticateToken.validateToken, userController.update.bind(userController));
routes.delete('/users/:_id', authenticateToken.validateToken, userController.destroy.bind(userController));
routes.post('/sessions', sessionController.store.bind(sessionController));
exports.default = routes;
