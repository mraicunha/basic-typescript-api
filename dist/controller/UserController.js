"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../model/User");
const index_1 = require("../utils/index");
class UserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find({});
                users.sort((a, b) => (a.email > b.email) ? 1 : -1);
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordUtils = new index_1.PasswordUtils();
                const { name, email, password } = req.body;
                const user = yield User_1.default.findOne({ email });
                if (user) {
                    return res.status(400).json({
                        error: {
                            error: 'Usuário já existe',
                            msg: 'O usuário que deseja cadastrar já existe cadastrado em nossa base de dados.'
                        }
                    });
                }
                const hash = yield passwordUtils.generateHash(password);
                yield User_1.default.create({
                    name,
                    email,
                    password: hash,
                    createAt: new Date(),
                });
                const users = yield User_1.default.find({});
                users.sort((a, b) => (a.email > b.email) ? 1 : -1);
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordUtils = new index_1.PasswordUtils();
                const { user } = req.body;
                Object.entries(user).forEach(entry => {
                    const [key, value] = entry;
                    if (!value) {
                        delete user[key];
                    }
                });
                if (user.password) {
                    user.password = yield passwordUtils.generateHash(user.password);
                }
                const userUpdate = yield User_1.default.findByIdAndUpdate({ _id: user._id }, user);
                if (!userUpdate) {
                    return res.status(400).json({
                        error: {
                            error: 'Usuário não encontrado',
                            msg: 'O usuário que deseja atualizar não foi encontrado. Por favor, atualize a página e tente novamente.'
                        }
                    });
                }
                const users = yield User_1.default.find({});
                users.sort((a, b) => (a.email > b.email) ? 1 : -1);
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const user = yield User_1.default.findById(_id);
                if (!user) {
                    return res.status(400).json({
                        error: {
                            error: 'Usuário não encontrado',
                            msg: 'O usuário que deseja remover não foi encontrado. Por favor, atualize a página e tente novamente.'
                        }
                    });
                }
                yield User_1.default.findByIdAndRemove(_id);
                const users = yield User_1.default.find({});
                users.sort((a, b) => (a.email > b.email) ? 1 : -1);
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
}
exports.UserController = UserController;
