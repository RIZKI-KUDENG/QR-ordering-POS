import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import {createServer} from "http";
import { Server } from "socket.io";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
})
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join-order", (orderId) => {
    console.log(`User ${socket.id} joining room: order-${orderId}`);
    socket.join(`order-${orderId}`); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.set("socketio", io)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

app.use(router);

httpServer.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
