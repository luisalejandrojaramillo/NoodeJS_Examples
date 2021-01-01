var express = require('express')
var router = express.Router()

router.use("/privada",(req,res,next)=>{
    console.log("No ha iniciado sesion")
    res.redirect("/inicio")
})

module.exports = router;