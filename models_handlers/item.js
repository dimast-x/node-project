const { DataTypes } = require("sequelize");
const db = require("../db.js");
const logger = require("../log.js");

const Item = db.define("Item", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

exports.GetAll = async (req, res, next) => {
  await Item.findAll()
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to get items: ", err);
      res.status(400).json({ err: err });
    });
};

exports.GetByID = async (req, res, next) => {
  await Item.findOne({ where: { id: req.params.id } })
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to get an item: ", err);
      res.status(400).json({ err: err });
    });
};

exports.DeleteByID = async (req, res, next) => {
  await Item.destroy({ where: { id: req.params.id } })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      logger.error("Unable to delete an item: ", err);
      res.status(400).json({ err: err });
    });
};

exports.UpdateByID = async (req, res, next) => {
  await Item.update(
    { name: req.body.name, description: req.body.description },
    { where: { id: req.params.id } }
  )
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to update an item: ", err);
      res.status(400).json({ err: err });
    });
};

exports.Insert = async (req, res, next) => {
  await Item.create({
    name: req.body.name,
    description: req.body.description,
  })
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to add an item: ", err);
      res.status(400).json({ err: err });
    });
};

exports.Item = Item;
