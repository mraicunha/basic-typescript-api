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
class UserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find({});
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
                const { name, email, password } = req.body;
                const user = yield User_1.default.findOne({ email });
                if (user) {
                    return res.status(400).json({
                        error: 'Usuário já existe',
                        msg: 'O usuário que está tentando cadastrar já existe em nossa base de dados'
                    });
                }
                yield User_1.default.create({ name, email, password });
                const users = yield User_1.default.find({});
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
}
exports.UserController = UserController;
