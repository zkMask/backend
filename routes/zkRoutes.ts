const express = require("express");

const zkController = require("../controller/zkController");

const router = express.Router();

router.post("/getZkHash", zkController.getZkHash);
router.post("/zkVerify", zkController.zkVerify);

module.exports = router;
