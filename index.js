// //task-1 implementation
// import http from "http";
// import { Server } from "socket.io";

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import userroutes from "./routes/auth.js";
// import videoroutes from "./routes/video.js";
// import likeroutes from "./routes/like.js";
// import watchlaterroutes from "./routes/watchlater.js";
// import historyrroutes from "./routes/history.js";
// import commentroutes from "./routes/comment.js";
// dotenv.config();
// const app = express();
// import path from "path";
// app.use(cors());
// app.use(express.json({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({ limit: "30mb", extended: true }));
// app.use("/uploads", express.static(path.join("uploads")));
// app.get("/", (req, res) => {
//   res.send("You tube backend is working");
// });
// app.use(bodyParser.json());
// app.use("/user", userroutes);
// app.use("/video", videoroutes);
// app.use("/like", likeroutes);
// app.use("/watch", watchlaterroutes);
// app.use("/history", historyrroutes);
// app.use("/comment", commentroutes);
// const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`server running on port ${PORT}`);
// // });

// const server = http.createServer(app);
// const socketIO = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });

// socketIO.on("connection", (socket) => {
//   console.log("User Connected successfully!", socket.id);

//   if (!socket.connected) {
//     socket.connect();
//   }
//   //connection the socket
//   socket.on("join-room", (roomId) => {
//     //joining the room-session
//     const room = socketIO.sockets.adapter.rooms.get(roomId);
//     const numberOfClients = room ? room.size : 0;
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);

//     if (numberOfClients > 0) {
//       socket.emit("createOffer")
//     }
//     // socket.to(roomId).emit("User_joined the room", socket.id);
//   });

//   // start connection with each other
//   socket.on("offer", ({ offer, roomId }) => {
//     socket.to(roomId).emit("offer", offer);
//   });

//   //Accept connection on each side
//   socket.on("answer", ({ answer, roomId }) => {
//     socket.to(roomId).emit("answer", answer);
//   });

//   //Network traversal
//   socket.on("ice-candidate", ({ candidate, roomId }) => {
//     socket.to(roomId).emit("ice candidate", candidate);
//   });

//   socket.on("disconnect", () => {
//     console.log("user Disconnected: ", socket.id);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port number: ${PORT}`)
// })

// const DBURL = process.env.DB_URL;
// mongoose
//   .connect(DBURL)
//   .then(() => {
//     console.log("Mongodb connected");
//   })
//   .catch((error) => {
//     console.log(error);
//   });


//task-1 implementation

import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});
import http from "http";
import { Server } from "socket.io";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import downloadroutes from "./routes/download.js";
import paymentroutes from "./routes/payment.js";
import downloadhistoryroutes from "./routes/downloadhistory.js";

import path from "path";


const app = express();

app.use(cors());

app.use(express.json({ limit: "5gb", extended: true }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "5gb",
  })
);

app.use("/uploads", express.static(path.join("uploads")));

app.get("/", (req, res) => {
  res.send("You tube backend is working");
});

app.use(
  bodyParser.json({
    limit: "5gb",
  })
);

app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/download", downloadroutes);
app.use("/payment", paymentroutes);
app.use("/downloadhistory", downloadhistoryroutes);
const PORT = process.env.PORT || 5000;

// =========================
// SOCKET.IO SETUP
// =========================

const server = http.createServer(app);

const socketIO = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketIO.on("connection", (socket) => {
  console.log("User Connected successfully!", socket.id);

  // =========================
  // JOIN ROOM
  // =========================

  socket.on("join-room", (roomId) => {
    const room = socketIO.sockets.adapter.rooms.get(roomId);


    const numberOfClients = room ? room.size : 0;

    socket.join(roomId);

    console.log(`Socket ${socket.id} joined room ${roomId} `);

    // Only second user creates offer
    if (numberOfClients > 0) {
      socket.emit("create-offer");
    }


  });

  // =========================
  // OFFER
  // =========================

  socket.on("offer", ({ offer, roomId }) => {
    console.log("Offer received from:", socket.id);
    socket.to(roomId).emit("offer", offer);
  });

  // =========================
  // ANSWER
  // =========================

  socket.on("answer", ({ answer, roomId }) => {
    console.log("Answer received from:", socket.id);
    socket.to(roomId).emit("answer", answer);
  });

  // =========================
  // ICE CANDIDATES
  // =========================

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  // =========================
  // DISCONNECT
  // =========================

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// =========================
// START SERVER
// =========================

server.listen(PORT, () => {
  console.log(`Server is running on port number: ${PORT}`);
});

// =========================
// DATABASE CONNECTION
// =========================

const DBURL = process.env.DB_URL;

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });
