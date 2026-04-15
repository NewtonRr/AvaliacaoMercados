import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import routes from './routes.ts';
import database from './db/db.ts';
import Usuario from './models/usuario.ts';

class App {
  static express: express.Express;
  static server: http.Server;
  static io: Server;

  static async init() {
    await database.authenticate();
    await Usuario.sync({ alter: true });

    App.express = express();
    App.server = http.createServer(App.express);
    App.io = new Server(App.server, {
      cors: {
        origin: '*',
      },
    });

    // Middleware
    App.express.use(cors());
    App.express.use(express.json());
    App.express.use(express.urlencoded({ extended: true }));

    // Routes
    App.routes();

    return App;
  }
  static getServer() {
    return App.server;
  }
  static routes() {
    App.express.use(routes)
  }
}

export default App;