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
// DESKTOP-GPN9M4H\\SQLEXPRESSDESKYOP-
const rdb= mysql.createConnection({
    host:`DESKTOP-GPN9M4H`,
    user:"mikrokom",
    password:"mikrokom2009/*-+",
    database:"RecDo"
})




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
app.get("/gmstry",(req,res)=>{
    const q = "SELECT * FROM recdotest"
    rdb.query(q,(err,data)=>{
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
app.post("/gmstry",async(req,res)=>{
    const pool = mariadb.createPool({
        host: req.body.host,
        user: req.body.user,
        password: req.body.password,
        database: req.body.db,
        connectionLimit: 5,
        acquireTimeout: 10000, // Adjust based on your needs (in milliseconds)
      });
    const newdb = mysql.createConnection({
        host:req.body.host || "",
        user:req.body.user || "",
        password:req.body.password || "",
        database:req.body.db || "",
    })
    if(req.body){
        await pool.getConnection().then((conn)=>res.json("bağlandı")).catch(()=>res.json("hata var"))
    }
    


    const qg = `SELECT * FROM ${req.body.table}`

    const q = "INSERT INTO recdotest (`cariAdi`,`vknTckn`,`genel_toplam`) VALUES (?)"
    // const values =[
    //     req.body.cariAdi,
    //     req.body.vknTckn,
    //     req.body.genel_toplam
    // ]
    newdb.query(qg,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

// if there is a auyh problem

// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY "12345678"
app.listen(process.env.PORT || 8800 ,()=>{
    console.log("invoice running !")
});