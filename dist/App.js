"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const https = require("https");
const fs = require("fs");
const routes_1 = require("./routes");
class App {
    constructor() {
        this.HTTP_PORT = 5000;
        this.HTTPS_PORT = 5443;
        this.privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
        this.certificate = fs.readFileSync('./ssl/server.crt', 'utf8');
        this.credentials = { key: this.privateKey, cert: this.certificate };
        this.use();
        this.database();
        this.listen();
        this.sockets();
    }
    use() {
        this.app = express();
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(routes_1.default);
        this.app.use((error, req, res, next) => {
            return res.status(500).json({ error: error.toString() });
        });
    }
    database() {
        mongoose.connection.openUri('mongodb://127.0.0.1/db_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    }
    sockets() {
        this.httpServer = http.createServer(this.app);
        this.httpsServer = https.createServer(this.credentials, this.app);
    }
    listen() {
    }
}
exports.App = App;
