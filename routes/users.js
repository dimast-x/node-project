const express = require('express')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.send(`Users list`)
    })
    .post((req, res) => {
        res.send(`New user created`)
    })

router.route('/:id')
    .get((req, res) => {
        console.log(req.item)
        res.send(`Get user with id: ${req.params.id}`)
    })
    .put((req, res) => {
        res.send(`Update a user with id: ${req.params.id}`)
    })
    .delete((req, res) => {
        res.send(`Delete a user with id: ${req.params.id}`)
    })

const user = [{ name: "User 1" }, { name: "User 2" }, { name: "User 3" }]
router.param("id", (req, res, next, id) => {
    req.user = user[id]    
    next()
})

module.exports = router
