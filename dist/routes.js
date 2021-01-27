"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./controller/index");
const routes = express_1.Router();
const sessionController = new index_1.SessionController();
const userController = new index_1.UserController();
routes.get('/', (req, res) => {
    return res.json({ msg: 'Hello World' });
});
routes.get('/users', userController.index.bind(userController));
routes.post('/users', userController.store.bind(userController));
routes.post('/sessions', sessionController.store.bind(sessionController));
exports.default = routes;
