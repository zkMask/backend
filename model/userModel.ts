const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  hashOfUniqueKey: {
    type: String,
  },
  folderLocation: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
