import express from "express";
import mysql from "mysql"
import cors from "cors"
import mariadb from 'mariadb';

const app=express()
app.use(express.json())
app.use(cors())



// DESKTOP-GPN9M4H\\SQLEXPRESSDESKYOP-


const hostingerdb= mysql.createConnection({
    host:"193.203.168.40",
    user:"u758955658_root",
    password:"Faruk7093",
    database:"u758955658_recdo"
})


app.get("/",(req,res)=>{
    res.json("Hello from sql backend")
})

app.get("/books",(req,res)=>{
 const db= mysql.createConnection({
     host:"localhost",
     user:"root",
     password:"",
     database:"recdo"
 })
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
app.get("/hostinger/gelen-fatura/:id", (req, res) => {
    const { id } = req.params;

    // Validate that id contains only alphanumeric characters
    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    const q = "SELECT * FROM ??";
    const values = [id];

    hostingerdb.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});



app.get("/hostinger/:id?", (req, res) => {
    const { id } = req.params;

    if (id) {
        // If ID is provided, fetch a specific record
        const q = "SELECT * FROM general WHERE id=?";
        hostingerdb.query(q, [id], (err, data) => {
            if (err) return res.json(err);

            if (data.length === 0) {
                return res.json("No data found");
            }

            return res.json(data[0]); // Assuming you want to return the first result
        });
    } 
});


app.post("/hostinger",(req,res)=>{
    const hostingerdb= mysql.createConnection({
        host:"193.203.168.40",
        user:"u758955658_root",
        password:"Faruk7093",
        database:"u758955658_recdo"
    })

    const {Fatura_No, ETTN, Fatura_Tarihi, Durum, Tur, Tip_Tur, Cari_Adi, Cari_Vkn_Tckn, Alias, Cari_Ulke, Cari_Sehir, Odenecek_Miktar, Vergi_Toplamı, Vergi_Haric_Tutar, Toplam_Indirim, Para_Birimi, Kur, Toplam_Kdv_1, Toplam_Kdv_8, Toplam_Kdv_18, Kdv_0_Matrah, Kdv_1_Matrah, Kdv_8_Matrah, Kdv_18_Matrah, Siparis_No, Senaryo, Tasimacilik, Sigorta, FOB, Lokal_Dokuman_No, Ekstra_Bilgi, Internet_Adresi, Alici_Email_Adresi, Mal_Hizmet_Sira_No, Mal_Hizmet_Adi, Mal_Hizmet_Miktar, Mal_Hizmet_Birim, Mal_Hizmet_Birim_Fiyat, Mal_Hizmet_Aciklama, Mal_Hizmet_Not, Mal_Hizmet_Satici_Kodu, Mal_Hizmet_Alici_Kodu, Mal_Hizmet_Toplam_Tutar, Mal_Hizmet_KDV_Orani, Mal_Hizmet_KDV_Tutari, Mal_Hizmet_OIV_Orani, Mal_Hizmet_OIV_Tutari, Not_1, Not_2, Not_3, Tevkifat_Tutari, Tevkifat_Orani, Mal_Hizmet_Vergi_Muafiyet_Kodu, Konaklama_Vergisi, Irsaliye_Bilgileri,reqType}=req.body;
    
    const q="INSERT INTO general (cariAdi, vknTckn,phone) VALUES (?)"
    const v=["faruk",123123,123123123]
    const query={
        qf : "INSERT INTO 8162953 (`Fatura_No`, `ETTN`,`Fatura_Tarihi`, `Durum`, `Tur`, `Tip_Tur`, `Cari_Adi`, `Cari_Vkn_Tckn`, `Alias`, `Cari_Ulke`, `Cari_Sehir`, `Odenecek_Miktar`, `Vergi_Toplamı`, `Vergi_Haric_Tutar`, `Toplam_Indirim`, `Para_Birimi`, `Kur`, `Toplam_Kdv_1`, `Toplam_Kdv_8`, `Toplam_Kdv_18`, `Kdv_0_Matrah`, `Kdv_1_Matrah`, `Kdv_8_Matrah`, `Kdv_18_Matrah`, `Siparis_No`, `Senaryo`, `Tasimacilik`, `Sigorta`, `FOB`, `Lokal_Dokuman_No`, Ekstra_Bilgi, `Internet_Adresi`, `Alici_Email_Adresi`, `Mal_Hizmet_Sira_No`, `Mal_Hizmet_Adi`, `Mal_Hizmet_Miktar`, `Mal_Hizmet_Birim`, `Mal_Hizmet_Birim_Fiyat`, `Mal_Hizmet_Aciklama`, `Mal_Hizmet_Not`, `Mal_Hizmet_Satici_Kodu`, `Mal_Hizmet_Alici_Kodu`, `Mal_Hizmet_Toplam_Tutar`, `Mal_Hizmet_KDV_Orani`, `Mal_Hizmet_KDV_Tutari`, `Mal_Hizmet_OIV_Orani`, `Mal_Hizmet_OIV_Tutari`, `Not_1`, `Not_2`, `Not_3`, `Tevkifat_Tutari`, `Tevkifat_Orani`, `Mal_Hizmet_Vergi_Muafiyet_Kodu`, `Konaklama_Vergisi`, `Irsaliye_Bilgileri`) VALUES (?)",
        qba: "INSERT INTO 8162953 (Fatura_No, ETTN,Fatura_Tarihi, Durum, Tur, Tip_Tur, Cari_Adi, Cari_Vkn_Tckn, Alias, Cari_Ulke, Cari_Sehir, Odenecek_Miktar, Vergi_Toplamı, Vergi_Haric_Tutar, Toplam_Indirim, Para_Birimi, Kur, Toplam_Kdv_1, Toplam_Kdv_8, Toplam_Kdv_18, Kdv_0_Matrah, Kdv_1_Matrah, Kdv_8_Matrah, Kdv_18_Matrah, Siparis_No, Senaryo, Tasimacilik, Sigorta, FOB, Lokal_Dokuman_No, Ekstra_Bilgi, Internet_Adresi, Alici_Email_Adresi, Mal_Hizmet_Sira_No, Mal_Hizmet_Adi, Mal_Hizmet_Miktar, Mal_Hizmet_Birim, Mal_Hizmet_Birim_Fiyat, Mal_Hizmet_Aciklama, Mal_Hizmet_Not, Mal_Hizmet_Satici_Kodu, Mal_Hizmet_Alici_Kodu, Mal_Hizmet_Toplam_Tutar, Mal_Hizmet_KDV_Orani, Mal_Hizmet_KDV_Tutari, Mal_Hizmet_OIV_Orani, Mal_Hizmet_OIV_Tutari, Not_1, Not_2, Not_3, Tevkifat_Tutari, Tevkifat_Orani, Mal_Hizmet_Vergi_Muafiyet_Kodu, Konaklama_Vergisi, Irsaliye_Bilgileri) VALUES (?)",
        qbe : "INSERT INTO 8162953 (`Fatura_No`, `ETTN`,`Fatura_Tarihi`, `Durum`, `Tur`, `Tip_Tur`, `Cari_Adi`, `Cari_Vkn_Tckn`, `Alias`, `Cari_Ulke`, `Cari_Sehir`, `Odenecek_Miktar`, `Vergi_Toplamı`, `Vergi_Haric_Tutar`, `Toplam_Indirim`, `Para_Birimi`, `Kur`, `Toplam_Kdv_1`, `Toplam_Kdv_8`, `Toplam_Kdv_18`, `Kdv_0_Matrah`, `Kdv_1_Matrah`, `Kdv_8_Matrah`, `Kdv_18_Matrah`, `Siparis_No`, `Senaryo`, `Tasimacilik`, `Sigorta`, `FOB`, `Lokal_Dokuman_No`, Ekstra_Bilgi, `Internet_Adresi`, `Alici_Email_Adresi`, `Mal_Hizmet_Sira_No`, `Mal_Hizmet_Adi`, `Mal_Hizmet_Miktar`, `Mal_Hizmet_Birim`, `Mal_Hizmet_Birim_Fiyat`, `Mal_Hizmet_Aciklama`, `Mal_Hizmet_Not`, `Mal_Hizmet_Satici_Kodu`, `Mal_Hizmet_Alici_Kodu`, `Mal_Hizmet_Toplam_Tutar`, `Mal_Hizmet_KDV_Orani`, `Mal_Hizmet_KDV_Tutari`, `Mal_Hizmet_OIV_Orani`, `Mal_Hizmet_OIV_Tutari`, `Not_1`, `Not_2`, `Not_3`, `Tevkifat_Tutari`, `Tevkifat_Orani`, `Mal_Hizmet_Vergi_Muafiyet_Kodu`, `Konaklama_Vergisi`, `Irsaliye_Bilgileri`) VALUES (?)"
    }
    
    
    const values =[
        Fatura_No, ETTN, Fatura_Tarihi, Durum, Tur, Tip_Tur, Cari_Adi, Cari_Vkn_Tckn, Alias, Cari_Ulke, Cari_Sehir, Odenecek_Miktar, Vergi_Toplamı, Vergi_Haric_Tutar, Toplam_Indirim, Para_Birimi, Kur, Toplam_Kdv_1, Toplam_Kdv_8, Toplam_Kdv_18, Kdv_0_Matrah, Kdv_1_Matrah, Kdv_8_Matrah, Kdv_18_Matrah, Siparis_No, Senaryo, Tasimacilik, Sigorta, FOB, Lokal_Dokuman_No, Ekstra_Bilgi, Internet_Adresi, Alici_Email_Adresi, Mal_Hizmet_Sira_No, Mal_Hizmet_Adi, Mal_Hizmet_Miktar, Mal_Hizmet_Birim, Mal_Hizmet_Birim_Fiyat, Mal_Hizmet_Aciklama, Mal_Hizmet_Not, Mal_Hizmet_Satici_Kodu, Mal_Hizmet_Alici_Kodu, Mal_Hizmet_Toplam_Tutar, Mal_Hizmet_KDV_Orani, Mal_Hizmet_KDV_Tutari, Mal_Hizmet_OIV_Orani, Mal_Hizmet_OIV_Tutari, Not_1, Not_2, Not_3, Tevkifat_Tutari, Tevkifat_Orani, Mal_Hizmet_Vergi_Muafiyet_Kodu, Konaklama_Vergisi, Irsaliye_Bilgileri
    ]
    
    hostingerdb.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json({data:data,statue:200})
    })
})

app.delete("/hostinger/:id",(req,res)=>{
    const rowId=req.params.id;
    const q="DELETE FROM general WHERE id=?";

    hostingerdb.query(q,[rowId],(err,data)=>{
        if(err) return res.json(err)
        return res.json("seçili satır silindi")

    })

})

app.put("/hostinger/:id", (req, res) => {
    const rowId = req.params.id;
    const values = [];
    let setClause = "";

    Object.keys(req.body).forEach((key) => {
        if (key !== 'id' && req.body[key] !== undefined) {
            setClause += `\`${key}\`=?, `;
            values.push(req.body[key]);
        }
    });

    // Remove the trailing comma and space from setClause
    setClause = setClause.slice(0, -2);

    const q = `UPDATE general SET ${setClause} WHERE id=?`;

    values.push(rowId);

    hostingerdb.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("seçili satır güncellendi");
    });
});






app.listen(process.env.PORT || 8800,()=>{
    console.log("invoice running !")
});