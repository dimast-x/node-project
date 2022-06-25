const express = require("express");
const auth = require("../auth.js");
const Item = require("../models_handlers/item.js");

const router = express.Router();

router.route("/").get(Item.GetAll).post(auth.authenticate, Item.Insert);

router
  .route("/:id")
  .get(Item.GetByID)
  .put(auth.authenticate, Item.UpdateByID)
  .delete(auth.authenticate, Item.DeleteByID);

module.exports = router;
