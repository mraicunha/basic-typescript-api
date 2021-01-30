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
exports.SessionController = void 0;
const jwt = require("jsonwebtoken");
const User_1 = require("../model/User");
const Token_1 = require("../model/Token");
const index_1 = require("../utils/index");
require('dotenv').config();
const { AUTH_SECRET } = process.env;
class SessionController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordUtils = new index_1.PasswordUtils();
                const { email, password } = req.body;
                const user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
                }
                const match = yield passwordUtils.compareHash(password, user.password);
                if (!match) {
                    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
                }
                const newToken = jwt.sign({ id: user.id }, AUTH_SECRET);
                const token = yield Token_1.default.findOne({ user: user._id });
                if (!token) {
                    yield Token_1.default.create({ token: newToken, user: user._id });
                }
                else {
                    token.token = newToken;
                    yield Token_1.default.findOneAndUpdate({ user: user._id }, token);
                }
                res.cookie('auth', newToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none'
                });
                return res.json({ logged: '1' });
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.res.locals;
                yield Token_1.default.findOneAndRemove({ user });
                return res.sendStatus(204);
            }
            catch (error) {
                return res.status(400).json({ error: error.toString() });
            }
        });
    }
}
exports.SessionController = SessionController;
