const express = require('express')
const aplicacion = express()
const bodyParser = require('body-parser')

const session = require('express-session');
const flash = require('express-flash');
aplicacion.use(session({ secret: 'token-muy-secreto', resave: true, saveUninitialized: true }));

aplicacion.use(bodyParser.json())
aplicacion.use(bodyParser.urlencoded({ extended: true }))
aplicacion.set('view engine','ejs')

aplicacion.use(flash())

aplicacion.get('/',(req,res)=>{
    res.render('pages/index',{error:req.flash('error')})
})

aplicacion.get('/home',(req,res)=>{
    res.render('pages/home',{usuario:req.session.usuario})
})

aplicacion.get('/detalle',(req,res)=>{
    res.render('pages/detalle',{usuario:req.session.usuario})
})

aplicacion.get('/salir',(req,res)=>{
    req.session.destroy();
    res.redirect("/")
})

aplicacion.post('/autenticar',(req,res)=>{
    if(req.body.usuario=='luis' && req.body.password=="123"){
        req.session.usuario = req.body.usuario; //Guardamos en sesion el user
        res.redirect("/home")
    }else{
        req.flash('error',"Datos incorrectos")
        res.redirect("/")
    }
})


aplicacion.get('/visitas', function(peticion, respuesta) {
    let visitas = peticion.session.visitas
    if (visitas == undefined){
      visitas = 0
    }
    visitas += 1
    peticion.session.visitas = visitas
    respuesta.send(`Visitas ${visitas}`);
});

aplicacion.get("/prueba", (req, res) => {
    const datos= {     nombre: "ZSE",  direccion: "Calle 3 con Avenida 3. Edificio AURA. Local 1",  telefonos: ["123-123123", "124-124124"]}  
    res.render("pages/ex",datos)
})

aplicacion.listen(8080,() => {
    console.log("Servidor Iniciado");
})