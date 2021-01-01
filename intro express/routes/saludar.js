var express = require('express')
var router = express.Router()

router.get("/hola", (req, res) => {
    res.send("Hola")
})

router.get("/hi", (req, res) => {
    res.send("Hi")
})

router.post("/hi", (req, res) => {
    res.send("Hii")
})

router.all("/hello", (req, res) => {
    res.send("Hello")
})

module.exports = router