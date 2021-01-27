"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
exports.default = mongoose.model('User', UserSchema);
