const express = require("express");
const auth = require("../auth.js");
const User = require("../models_handlers/user.js");

const router = express.Router();

router.get("/", auth.adminMiddleware, User.GetAll);

router
  .route("/:id")
  .get(auth.adminMiddleware, User.GetById)
  .delete(User.DeleteById);

router.post("/login", User.Login);
router.post("/register", User.Register);
router.put("/promote", auth.adminMiddleware, User.Promote);
router.put("/fire", auth.superAdminMiddleware, User.Fire);
router.put("/chpassword", auth.authenticate, User.ChangePassword);

module.exports = router;
