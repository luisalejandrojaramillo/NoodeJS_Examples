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

// API Rest
application.get('/api/tareas',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM tareas`
        connection.query(query,function(error,filas,campos){
            res.json({data: filas})
        })
        connection.release()
    })  
})

application.get('/api/tareas/:id',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM tareas WHERE idtareas=${connection.escape(req.params.id)}`
        connection.query(query,function(error,filas,campos){
            if(filas.length>0){
                res.json({data: filas[0]})
            }else{
                res.status(404)
                res.send({error:["No se encuentra esa tarea"]})
            }           
        })
        connection.release()
    })  
})

application.put('/api/tareas/:id',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM tareas WHERE idtareas=${connection.escape(req.params.id)}`
        connection.query(query,function(error,filas,campos){
            if(filas.length>0){
                const queryUpdate = `UPDATE tareas SET descripcion ${connection.escape(req.body.descripcion)} WHERE idtareas=${connection.escape(req.params.id)}`
                connection.query(queryUpdate,(error, filas, campos)=>{
                    const queryConsulta = `SELECT * FROM tareas WHERE idtareas=${connection.escape(req.params.id)}`
                    connection.query(queryConsulta,(error,filas,campos)=>{
                        res.json({data: filas[0]})
                    })
                })

            }else{
                res.status(404)
                res.send({error:["No se encuentra esa tarea"]})
            }           
        })
        connection.release()
    })  
})

application.delete('/api/tareas/:id',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM tareas WHERE idtareas=${connection.escape(req.params.id)}`
        connection.query(query,function(error,filas,campos){
            if(filas.length>0){
                const queryDelete = `DELETE FROM tareas WHERE idtareas=${connection.escape(req.params.id)}`
                connection.query(queryUpdate,(error, filas, campos)=>{
                   res.status(204) 
                   res.json()
                })
            }else{
                res.status(404)
                res.send({error:["No se encuentra esa tarea"]})
            }           
        })
        connection.release()
    })  
})

// No pude probar el POST desde postman pero esta bien
application.post('/api/tareas/',function(req,res){
    pool.getConnection(function(err,connection){
        console.log(req.body.descripcion)
        const query = `INSERT INTO tareas_app.tareas (descripcion) VALUES (${connection.escape(req.body.descripcion)});`
        connection.query(query,function(error,filas,campos){
            res.status(201)
            const newid = filas.insertId
            //console.log(newid)
            const queryConsulta = `SELECT * FROM tareas WHERE idtareas=${connection.escape(newid)}`
            connection.query(queryConsulta,function(error,filas,campos){
                res.status(201)
                res.json({data:filas[0]})
            })
        })
        connection.release()
    })  
})

// DB App
application.get('/',(req,res)=>{
    pool.getConnection(function(er,connection){
        const query = `SELECT * FROM tareas`
        connection.query(query,function(error,filas,campos){
            res.render('index',{tareas: filas})
        })
        connection.release()
    })  
})

application.post('/agregar-tarea',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `INSERT INTO tareas_app.tareas (descripcion) VALUES (${connection.escape(req.body.descripcion)});`
        console.log(req.body.descripcion)
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