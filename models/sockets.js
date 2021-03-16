const {
  usuarioConectado,
  usuarioDesconectado,
} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    //   On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("Socket no identificado");
        return socket.disconnect();
      }

      await usuarioConectado(uid);

      socket.on("disconnect", async () => {
        await usuarioDesconectado(uid);
      });
    });
  }
}

module.exports = Sockets;
