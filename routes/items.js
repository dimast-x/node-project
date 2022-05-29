const express = require('express')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.send(`Items list`)
    })
    .post((req, res) => {
        res.send(`New item created`)
    })

router.route('/:id')
    .get((req, res) => {
        console.log(req.item)
        res.send(`Get item with id: ${req.params.id}`)
    })
    .put((req, res) => {
        res.send(`Update an item with id: ${req.params.id}`)
    })
    .delete((req, res) => {
        res.send(`Delete an item with id: ${req.params.id}`)
    })

const items = [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }]
router.param("id", (req, res, next, id) => {
    req.item = items[id]    
    next()
})


module.exports = router