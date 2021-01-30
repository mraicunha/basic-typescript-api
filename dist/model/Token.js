"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const TokenModel = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Token = mongoose.model('Token', TokenModel);
exports.default = Token;
