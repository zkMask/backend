const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const hashRouter = require("./routes/hashRoutes");
const recognitionRouter = require("./routes/recognitionRoutes");
const zkRouter = require("./routes/zkRoutes");

const app = express();
const bodyParser = require("body-parser");

const http = require("http").createServer(app);
const io = require("socket.io")(http);

// io.on("connection", (socket: any) => {
//   console.log("A user connected");
//   // Additional socket event handling can be added here
// });

app.use(morgan("dev"));
app.use(
  cors()
);

app.use(bodyParser.json({ limit: "50mb" }));

app.get("/api/v1", (req: any, res: any, next: any) => {
  res.send("Test working");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/hash", hashRouter);
app.use("/api/v1/recognition", recognitionRouter);
app.use("/api/v1/zk", zkRouter);

(module.exports = app), io, http;
