const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  // **We have now access to the user id
  res.send(req.user);
});

module.exports = router;
