const express=require("express");
const app=express();//creation d'une istance express
const cors=require('cors');//middleware utlise les requettes HTTP pour specifier à un site web quel requete va etre accepte 
const mysql =require('mysql');
const bodyParser=require("body-parser");//pour parser ou analyser les donnees de type urlencoded
const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'password',
    database:'podcastdb',
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get("/api/get",(req,res)=>{
    const sqlSelect="SELECT * FROM podcastdb.podcasttb ";
    db.query(sqlSelect,(err,result)=>{res.send(result)});
 })
 app.listen(3003,()=>console.log("listening to port 3003"));