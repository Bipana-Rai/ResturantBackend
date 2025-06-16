const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const addItems = require("./controller/addItems");
const cartItem = require("./controller/cartItem");
const tableItem = require("./controller/tableItem");
const bookingItem = require("./controller/bookingItem");
const takeawayOrders = require("./controller/takeawayOrders");
const authentication = require("./controller/authentication");
const receit = require("./controller/receits");
const cors = require("cors");
const path = require("path");
const http = require("http"); //using server http so that it can support socket
const socketIo = require("socket.io"); //for real time notification
const cookieParser = require("cookie-parser");

const app = express();
const allowedOrigin = [
  "https://resturant-admin-ten.vercel.app",
  "https://resturant-admin-2zy376jme-bipana-rais-projects.vercel.app",
];


const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: allowedOrigin,
//     credentials: true,
//   },
// });
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a cient connected via socked.io");

  socket.on("disconnected", () => {
    console.log("Client disconnected");
  });
});

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // VERY IMPORTANT for cookies
  })
);



app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://bipanarai:Bipana123@cluster0.rnhqnoe.mongodb.net/Resturant",
    {}
  )
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection error:", error);
  });

app.use("/api", addItems);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //app.use le chai as a middleware kaam garxa,yo line le chai hamile upload gareko file lae  access grna help garxa,so that upload vako file hami frontend ma use garna sakxam
app.use("/api", cartItem);
app.use("/api", tableItem);
app.use("/api", bookingItem);
app.use("/api", authentication);
app.use("/api", takeawayOrders);
app.use("/api", receit);

const orderItems = require("./controller/orderItems")(io); //io lae ordercontroller ma pass gareko
app.use("/api", orderItems);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
