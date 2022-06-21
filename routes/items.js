const { DataTypes } = require('sequelize');
const express = require('express')
const db = require('../db.js')
const router = express.Router()

const Book = db.define('Book', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
});

router.route('/')
    .get(async (req, res) => {
        await Book.findAll().then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.status(400).json({
                err: err,
            });
        });
    })
    .post(async (req, res) => {
        Book.create({
            name: req.body.name,
            description: req.body.description,
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.status(400).json({
                err: err,
            });
        });
    })

router.route('/:id')
    .get(async (req, res) => {
        await Book.findOne({ where: { id: req.params.id } }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.status(400).json({
                err: err,
            });
        });
    })
    .put(async (req, res) => {
        await Book.update(
            { name: req.body.name, description: req.body.description },
            { where: { id: req.params.id } }).then(function (result) {
                res.json(result);
            }).catch(function (err) {
                res.status(400).json({
                    err: err,
                });
            });
    })
    .delete(async (req, res) => {
        await Book.destroy({ where: { id: req.params.id } }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.status(400).json({
                err: err,
            });
        });
    })

module.exports = router