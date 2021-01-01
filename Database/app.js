const express = require('express');
const application = express();
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 20, //Limita el numero simultaneo de clinetes conectados a la BD
    host    : 'localhost',
    user    : 'root',
    password: '123456',
    database: 'blog'
});

//connection.connect();



application.set('view engine','ejs')

// Para probar:
// localhost:8080/noticias?autor=luis
application.get('/noticias',(req,res)=>{
    pool.getConnection(function(err,connection){
        const query = `SELECT * FROM noticias WHERE autor = ${connection.escape(req.query.autor)}` //escape para evitar problemas de seguridad
        connection.query(query,function(error,filas,campos){
            res.render('index',{noticias: filas})
        })
        connection.release() //Liberamos la conexion 
    })
})



application.listen(8080,function(){
    console.log("Servidor iniciado")
})

/** 
const connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '123456',
    database: 'blog'
});
connection.connect();

application.get('/',(req,res)=>{
    connection.query('SELECT COUNT(*) as cuenta FROM noticias',function(error,filas,campos){
        res.render('index',{total: filas[0].cuenta})
    })
})
*/