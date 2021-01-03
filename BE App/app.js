const express = require('express');
const application = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

application.set('view engine','ejs')
application.use(bodyParser.json())
application.use(bodyParser.urlencoded({extended: true}))

var pool = mysql.createPool({
    connectionLimit: 20,
    host    : 'localhost',
    user    : 'root',
    password: '123456',
    database: 'tareas_app'
})

application.get('/',(req,res)=>{
    pool.getConnection(function(er,connection){
        const query = `SELECT * FROM tareas`
        connection.query(query,function(error,filas,campos){
            res.render('index',{tareas: filas})
        })
    })  
})

application.post('/agregar-tarea',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `INSERT INTO tareas_app.tareas (descripcion) VALUES (${connection.escape(req.body.descripcion)});`
        connection.query(query,(error,filas,campos)=>{
            res.redirect("/")
        })
        connection.release()
    })
})

application.get('/actualizar-form',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM tareas_app.tareas WHERE idtareas = ${connection.escape(req.query.id)};`
        connection.query(query,function(error,filas,campos){
            res.render('actualizar', {tarea: filas[0]})
        })
        connection.release()
    })
})

application.post('/actualizar-tarea',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `UPDATE tareas_app.tareas SET descripcion=${connection.escape(req.body.descripcion)} WHERE idtareas=${connection.escape(req.body.id)};`
        console.log(req.body.descripcion+'...'+req.body.id)
        connection.query(query,(error,filas,campos)=>{
            res.redirect("/")
        })
        connection.release()
    })
})

application.get('/eliminar-tarea',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `DELETE FROM tareas_app.tareas WHERE idtareas = ${connection.escape(req.query.id)};`
        connection.query(query,function(error,filas,campos){
            res.redirect('/')
        })
        connection.release()
    })
})

application.listen(8080,function(){
    console.log("Servidor iniciado")
})