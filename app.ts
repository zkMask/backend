const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const hashRouter = require("./routes/hashRoutes");
const recognitionRouter = require("./routes/recognitionRoutes");

const app = express();
const bodyParser = require("body-parser");

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json({ limit: "50mb" }));

app.get("/api/v1", (req: any, res: any, next: any) => {
  res.send("Test working");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/hash", hashRouter);
app.use("/api/v1/recognition", recognitionRouter);

module.exports = app;
