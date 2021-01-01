var express = require('express')
var aplicacion = express()

const rutasSaludar = require('./routes/saludar')

aplicacion.use('/saludar',rutasSaludar)

aplicacion.get("/", (req, res) => {
    res.send("Bienvenido")
})
aplicacion.listen(8080,() => {
    console.log("Servidor Iniciado");
})
// 4 minutos de video 