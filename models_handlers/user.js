const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const auth = require("../auth.js");
const db = require("../db.js");
const logger = require("../log.js");

const User = db.define("User", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.STRING,
});

exports.GetAll = async (req, res, next) => {
  await User.findAll({ attributes: ["id", "username", "role"] })
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to list users: ", err);
      res.status(400).json({ err: err });
    });
};

exports.GetById = async (req, res, next) => {
  await User.findOne(
    { where: { id: req.params.id } },
    { attributes: ["id", "username", "role"] }
  )
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to get a user: ", err);
      res.status(400).json({ err: err });
    });
};

exports.DeleteById = async (req, res, next) => {
  await User.destroy({ where: { id: req.params.id } })
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (err) {
      logger.error("Unable to delete a user: ", err);
      res.status(400).json({ err: err });
    });
};

exports.Login = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    return res.json({ sucess: false, err: "password is too short" });
  }
  if (username.length < 5) {
    return res.json({ sucess: false, err: "username is too short" });
  }

  await User.findOne({ where: { username: username, password: password } })
    .then(function (user) {
      let token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        auth.secret,
        { expiresIn: 3600 }
      );
      res.json({ sucess: true, err: null, token });
    })
    .catch(function (err) {
      logger.error("Unable to login a user: ", err);
      return res.status(401).json({
        sucess: false,
        token: null,
        err: "Username or password is incorrect",
      });
    });
};

exports.Register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    return res.json({ sucess: false, err: "password is too short" });
  }
  if (username.length < 5) {
    return res.json({ sucess: false, err: "username is too short" });
  }

  await User.create({
    username: username,
    password: password,
    role: "user",
  })
    .then(function () {
      res.json({ sucess: true, err: null });
    })
    .catch(function (err) {
      logger.error("Unable to register a user: ", err);
      res.status(400).json({
        sucess: false,
        err: err,
      });
    });
};

exports.Promote = async (req, res, next) => {
  const { username } = req.body;

  await User.findOne({ where: { username: username } })
    .then(async function (user) {
      if (!user) {
        res.status(404).json({
          sucess: false,
          err: "user: " + username + " not found",
        });
      } else if (user.role == "user") {
        await User.update({ role: "admin" }, { where: { username: username } })
          .then(function (user) {
            logger.info(`${username} was promoted by ${req.user.username} `);
            res.status(200).json({
              sucess: true,
              err: null,
            });
          })
          .catch(function (err) {
            logger.error("Unable to update a user: ", err);
            res.status(400).json({ sucess: false, err: err });
          });
      } else {
        res.status(400).json({
          sucess: false,
          err: "user: " + username + " is alredy admin",
        });
      }
    })
    .catch(function (err) {
      logger.error("Unable to find a user: ", err);
      res.status(400).json({ sucess: false, err: err });
    });
};

exports.Fire = async (req, res, next) => {
  const { username } = req.body;
  await User.findOne({ where: { username: username } })
    .then(async function (user) {
      if (!user) {
        res.status(404).json({
          sucess: false,
          err: "user: " + username + " not found",
        });
      } else if (user.role == "admin") {
        await User.update({ role: "user" }, { where: { username: username } })
          .then(function (user) {
            logger.info(`${username} was fired by ${req.user.username} `);
            return res.status(200).json({ sucess: true, err: null });
          })
          .catch(function (err) {
            logger.error("Unable to update a user: ", err);
            res.status(400).json({ sucess: false, err: err });
          });
      } else {
        res.status(400).json({
          sucess: false,
          err: "user: " + username + " is not admin",
        });
      }
    })
    .catch(function (err) {
      logger.error("Unable to find a user: ", err);
      res.status(400).json({ sucess: false, err: err });
    });
};

exports.ChangePassword = async (req, res, next) => {
  const { password } = req.body;
  const { role, username } = req.user;
  if (password.length < 8) {
    return res.json({ sucess: false, err: "password is too short" });
  }

  if (req.body.username) {
    if (role == "admin" || role == "superadmin") {
      await User.findOne({ where: { username: req.body.username } })
        .then(async function (user) {
          if (!user) {
            res.status(404).json({
              sucess: false,
              err: "user: " + req.body.username + " not found",
            });
          } else {
            await User.update(
              { password: password },
              { where: { username: req.body.username } }
            )
              .then(function (user) {
                logger.info(
                  `${req.user.username} changed password of ${req.body.username} to ${password}`
                );
                res.status(200).json({ sucess: true, err: null });
              })
              .catch(function (err) {
                logger.error("Error when updating passport: ", err);
                res.status(400).json({ sucess: false, err: err });
              });
          }
        })
        .catch(function (err) {
          logger.error("Error when updating passport: ", err);
          res.status(400).json({
            sucess: false,
            err: err,
          });
        });
    } else {
      res.status(403).json({
        sucess: false,
        err: "Not enough permissions to perform this operation",
      });
    }
  } else {
    await User.update({ password: password }, { where: { username: username } })
      .then(function () {
        res.status(200).json({ sucess: true, err: null });
      })
      .catch(function (err) {
        logger.error("Error when updating passport: ", err);
        res.status(400).json({ sucess: false, err: err });
      });
  }
};

exports.User = User;
