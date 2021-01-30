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
exports.AuthenticateToken = void 0;
const User_1 = require("../model/User");
const Token_1 = require("../model/Token");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { AUTH_SECRET } = process.env;
class AuthenticateToken {
    validateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auth } = req.cookies;
                if (!auth) {
                    return res.sendStatus(401);
                }
                else {
                    const decode = jwt.verify(auth, AUTH_SECRET);
                    const user = yield User_1.default.findById({ _id: decode.id });
                    if (!user) {
                        return res.sendStatus(401);
                    }
                    else {
                        const token = yield Token_1.default.findOne({ user: user._id });
                        if (!token) {
                            return res.sendStatus(401);
                        }
                        else {
                            if (token.token === auth) {
                                res.locals.user = user._id;
                                next();
                            }
                            else {
                                return res.sendStatus(401);
                            }
                        }
                    }
                }
            }
            catch (error) {
                return res.status(401).json(error);
            }
        });
    }
}
exports.AuthenticateToken = AuthenticateToken;
