const { DataTypes } = require("sequelize");
const winston = require("winston");
const express = require("express");
const auth = require("../auth.js");
const db = require("../db.js");
const router = express.Router();

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "items-service" },
  transports: [
    new winston.transports.File({
      filename: process.env.ERR_LOG_PATH,
      level: "error",
    }),
    new winston.transports.File({ filename: process.env.COMBINED_LOG_PATH }),
  ],
});

const Item = db.define("Item", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

router
  .route("/")
  .get(async (req, res) => {
    await Item.findAll()
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        logger.error("Unable to get items: ", err);
        res.status(400).json({
          err: err,
        });
      });
  })
  .post(auth.authenticate, async (req, res) => {
    Item.create({
      name: req.body.name,
      description: req.body.description,
    })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        logger.error("Unable to add an item: ", err);
        res.status(400).json({
          err: err,
        });
      });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    await Item.findOne({ where: { id: req.params.id } })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        logger.error("Unable to get an item: ", err);
        res.status(400).json({
          err: err,
        });
      });
  })
  .put(auth.authenticate, async (req, res) => {
    await Item.update(
      { name: req.body.name, description: req.body.description },
      { where: { id: req.params.id } }
    )
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        logger.error("Unable to update an item: ", err);
        res.status(400).json({
          err: err,
        });
      });
  })
  .delete(auth.authenticate, async (req, res) => {
    await Item.destroy({ where: { id: req.params.id } })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        logger.error("Unable to delete an item: ", err);
        res.status(400).json({
          err: err,
        });
      });
  });

module.exports = router;
