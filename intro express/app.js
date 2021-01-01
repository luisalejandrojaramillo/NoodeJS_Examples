var express = require('express')
var aplicacion = express()
const autenticador = require("./middleware/autenticador")

const bodyParser = require('body-parser')

aplicacion.use(bodyParser.json())
aplicacion.use(bodyParser.urlencoded({ extended: true }))

//Middleware: imprime por cada peticion
aplicacion.use((req,res,next)=>{
    var fecha = new Date;
    var navegador = req.headers["user-agent"];
    var metodo = req.method;
    var url = req.url;
    var ip = req.connection.remoteAddress;
    console.log(fecha+metodo+url+ip+navegador)
    next()
})

aplicacion.get("/", (req, res) => {
    res.send(`Bienvenido ${req.query.nombre}`)
})

aplicacion.get("/form", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Ejemplo</title>
    </head>
    <body>
        <h1>Ejemplo</h1>
        <div>
            <form action="/procesar" method="POST">
                <p>
                    <label for="numero">numero</label>
                    <input type="text" name="numero">
                </p>
                <p>
                    <button type="submit">Calcular</button>
                </p>
            </form>
        </div>
    </body>
    </html>
    `)
})

aplicacion.post('/procesar',(req,res)=>{
    res.send(`Numero: ${req.body.numero}}`);
})

aplicacion.get('/persona/:id',function(req,res){
    res.send(`Hola: ${req.params.id}`);
})

aplicacion.get("/inicio",(req,res)=>{
    res.sendFile(__dirname+"/public/inicio.html")
})

//aplicacion.use(autenticador)

aplicacion.get("/privada", (req, res) => {
    res.send("Privada")
})

// Login V1
aplicacion.get('/login', function(peticion, respuesta) {
    respuesta.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Inicio de Sesion</title>
    </head>
    <body>
      <h1>Inicio de Sesión</h1>
      <div>
        <form action="/validar" method="post">
          <p>
            <label for="">Usuario</label>
            <input type="text" name="usuario">
          </p>
          <p>
            <label for="">Email</label>
            <input type="text" name="email">
          </p>
          <p>
            <button type="submit">Continuar</button>
          </p>
        </form>
      </div>
    </body>
    </html>`);
  });
  
  aplicacion.post('/validar', function(peticion, respuesta) {
    let re;
    re = /^[^ ]{6,}/
    if (!re.test(peticion.body.usuario)){
      respuesta.send("ERROR")
      return
    }
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(peticion.body.email)){
      respuesta.send("ERROR")
      return
    }
    respuesta.send("OK")
  });

aplicacion.listen(8080,() => {
    console.log("Servidor Iniciado");
})