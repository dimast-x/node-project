const DataTypes = require('sequelize');
const jwt = require('jsonwebtoken');
const express = require('express');
const auth = require('../auth.js');
const db = require('../db.js');
const router = express.Router();
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const User = db.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
});

router.get('/', auth.adminMiddleware, async (req, res) => {
    logger.info(`${req.user.username} got the list of users`)
    await User.findAll({ attributes: ['id', 'username', 'role'] }).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        logger.error('Unable to list users: ', err);
        res.status(400).json({
            err: err,
        });
    });
})

router.route('/:id')
    .get(auth.adminMiddleware, async (req, res) => {
        logger.info(`${req.user.username} got information about a user with id: ${req.params.id}`)
        await User.findOne({ where: { id: req.params.id } }, { attributes: ['id', 'username', 'role'] }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            logger.error('Unable to get a user: ', err);
            res.status(400).json({
                err: err,
            });
        });
    })
    .delete(auth.superAdminMiddleware, async (req, res) => {
        await User.destroy({ where: { id: req.params.id } }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            logger.error('Unable to delete a user: ', err);
            res.status(400).json({
                err: err,
            });
        });
    });

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await User.findOne({ where: { username: username, password: password } }).then(function (user) {
        let token = jwt.sign({ id: user.id, username: user.username, role: user.role }, auth.secret, { expiresIn: 129600 }); // Sigining the token
        res.json({
            sucess: true,
            err: null,
            token,
        });
    }).catch(function (err) {
        logger.error('Unable to login a user: ', err);
        return res.status(401).json({
            sucess: false,
            token: null,
            err: 'Username or password is incorrect',
        });
    });
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (pass == "" || pass.length < 8) {
        return res.json({
            sucess: false,
            err: "password is too short",
        });
    }
    if (username.length < 5) {
        return res.json({
            sucess: false,
            err: "username is too short",
        });
    }
    await User.create({
        username: username,
        password: password,
        role: "user",
    }).then(function () {
        res.json({
            sucess: true,
            err: null,
        });
    }).catch(function (err) {
        logger.error('Unable to register a user: ', err);
        res.status(400).json({
            sucess: false,
            err: err,
        });
    });
});

router.post('/promote', auth.adminMiddleware, async (req, res) => {
    const { username } = req.body;

    await User.findOne({ where: { username: username } }).then(async function (user) {
        if (!user) {
            res.status(404).json({
                sucess: false,
                err: 'user: ' + username + ' not found',
            });
        } else if (user.role == 'user') {
            await User.update(
                { role: 'admin' },
                { where: { username: username } }).then(function (user) {
                    logger.info(`${username} was promoted by ${req.user.username} `)
                    res.status(200).json({
                        sucess: true,
                        err: null,
                    });
                }).catch(function (err) {
                    logger.error('Unable to update a user: ', err);
                    res.status(400).json({
                        sucess: false,
                        err: err,
                    });
                });
        } else {
            res.status(400).json({
                sucess: false,
                err: 'user: ' + username + ' is alredy admin',
            });
        }
    }).catch(function (err) {
        logger.error('Unable to find a user: ', err);
        res.status(400).json({
            sucess: false,
            err: err,
        });
    });
});

router.post('/fire', auth.superAdminMiddleware, async (req, res) => {
    const { username } = req.body;
    await User.findOne({ where: { username: username } }).then(async function (user) {
        if (!user) {
            res.status(404).json({
                sucess: false,
                err: 'user: ' + username + ' not found',
            });
        } else if (user.role == 'admin') {
            await User.update(
                { role: 'user' },
                { where: { username: username } }).then(function (user) {
                    logger.info(`${username} was fired by ${req.user.username} `)
                    return res.status(200).json({
                        sucess: true,
                        err: null,
                    });
                }).catch(function (err) {
                    logger.error('Unable to update a user: ', err);
                    res.status(400).json({
                        sucess: false,
                        err: err,
                    });
                });
        } else {
            res.status(400).json({
                sucess: false,
                err: 'user: ' + username + ' is not admin',
            });
        }
    }).catch(function (err) {
        logger.error('Unable to find a user: ', err);
        res.status(400).json({
            sucess: false,
            err: err,
        });
    });
});

router.post('/chpassword', auth.authenticate, async (req, res) => {
    const { password } = req.body;
    const { role, username } = req.user;
    if (pass == "" || pass.length < 8) {
        return res.json({
            sucess: false,
            err: "password is too short",
        });
    }
    usr = req.body.username;
    if (usr) {
        if (role == "admin" || role == "superadmin") {
            await User.findOne({ where: { username: usr } }).then(async function (user) {
                if (!user) {
                    res.status(404).json({
                        sucess: false,
                        err: 'user: ' + usr + ' not found',
                    });
                } else {
                    await User.update(
                        { password: password },
                        { where: { username: usr } }).then(function (user) {
                            logger.info(`${req.user.username} changed password of ${usr} to ${password}`)
                            res.status(200).json({
                                sucess: true,
                                err: null,
                            });
                        }).catch(function (err) {
                            logger.error('Error when updating passport: ', err);
                            res.status(400).json({
                                sucess: false,
                                err: err,
                            });
                        });
                }
            }).catch(function (err) {
                logger.error('Error when updating passport: ', err);
                res.status(400).json({
                    sucess: false,
                    err: err,
                });
            });
        } else {
            res.status(403).json({
                sucess: false,
                err: 'Not enough permissions to perform this operation',
            })
        }
    } else {
        await User.update(
            { password: password },
            { where: { username: username } }).then(function (user) {
                res.status(200).json({
                    sucess: true,
                    err: null,
                });
            }).catch(function (err) {
                logger.error('Error when updating passport: ', err);
                res.status(400).json({
                    sucess: false,
                    err: err,
                });
            });
    }
});

module.exports = router
