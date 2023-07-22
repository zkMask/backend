import express from "express";
const hashControllers = require("../controller/hashControllers");

const router = express.Router();

router.post("/hash", hashControllers.hash);

module.exports = router;
