// Servidor de express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Sockets = require("./sockets");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    dbConnection();

    // Http server
    this.server = http.createServer(this.app);
    // Configraciones de sockets
    this.io = socketio(this.server, {
      /*Configuracion*/
    });
  }

  middlewares() {
    // Desplegar el directorio publico
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    // CORS
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use("/api/login", require("../router/auth"));
    this.app.use("/api/mensajes", require("../router/mensajes"));
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar Sockets
    this.configurarSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log(`Server corriendo en puerto: ${this.port}`);
    });
  }
}

module.exports = Server;
