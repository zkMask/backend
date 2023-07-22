const dotenv = require("dotenv");
const App = require("./app.ts");
const mongoose = require("mongoose");

dotenv.config();

if (!process.env.DATABASE) {
  throw new Error("Database URL must be set in .env file");
}
if (!process.env.DATABASE_PASSWORD) {
  throw new Error("Database Password must be set in .env file");
}

const DB = process.env.DATABASE?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err: any) => {
    console.log(err);
  });

const PORT = process.env.PORT || 4000;

App.listen(PORT, () => {
  console.log("Server Started on Port", PORT);
});
