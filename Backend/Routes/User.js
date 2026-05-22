const router = require("express").Router();
const { Login, signUp } = require("../Controllers/User");

router.post("/login", Login);
router.post("/signup", signUp);

module.exports = router;
