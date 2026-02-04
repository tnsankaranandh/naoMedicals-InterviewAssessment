const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", (data) => {
      // Emit message to all users in conversation
      io.to(data.conversationId).emit("receiveMessage", data);

      // Notify doctor if sender is patient
      if (data.senderRole === "patient") {
        io.emit("doctorNotification", {
          conversationId: data.conversationId
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
