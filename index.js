import express from "express";
import mysql from "mysql"
import cors from "cors"
import mariadb from 'mariadb';

const app=express()
app.use(express.json())
app.use(cors())
const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"recdo"
})

const hostingerdb= mysql.createConnection({
    host:"193.203.168.40",
    user:"u758955658_root",
    password:"Faruk7093",
    database:"u758955658_recdo"
})
// DESKTOP-GPN9M4H\\SQLEXPRESSDESKYOP-



app.get("/",(req,res)=>{
    res.json("Hello from sql backend")
})

app.get("/books",(req,res)=>{

    const q = "SELECT * FROM books"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})
app.get("/hostinger",(req,res)=>{

    const q = "SELECT * FROM general"
    hostingerdb.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/books",(req,res)=>{
    const q = "INSERT INTO books (`title`,`description`,`cover`) VALUES (?)"
    const values =[
        req.body.title,
        req.body.description,
        req.body.cover
    ]
    
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})




// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY "12345678"
app.listen(process.env.PORT || 8800,"0.0.0.0",()=>{
    console.log("invoice running !")
});