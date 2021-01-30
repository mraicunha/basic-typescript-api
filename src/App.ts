import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import routes from './routes';

export class App {
  public app: express.Application;
  public httpServer: http.Server;
  public httpsServer: https.Server;
  public HTTP_PORT: number = 5000;
  public HTTPS_PORT: number = 5443;
  private privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
  private certificate = fs.readFileSync('./ssl/server.crt', 'utf8');
  private credentials = { key: this.privateKey, cert: this.certificate };

  constructor() {
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
    this.app.use(routes);
    this.app.use((error, req, res, next) => {
      return res.status(500).json({ error: error.toString() });
    });
  }

  database() {
    mongoose.connection.openUri('mongodb://mrai:log102030@127.0.0.1/db_basic_api', {
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  private sockets(): void {
    this.httpServer = http.createServer(this.app);
    this.httpsServer = https.createServer(this.credentials, this.app);
  }

  private listen(): void {

  }
}
