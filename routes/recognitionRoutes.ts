import express from "express";

const recognitionController = require("../controller/recognitionController");

const router = express.Router();

router.post("/recognize", recognitionController.recognize);
// router.post("/login", userController.login);

module.exports = router;
