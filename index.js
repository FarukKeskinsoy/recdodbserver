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
     host:"127.0.0.1",
     user:"user",
     password:"password",
     database:"recdo",
     port:3306
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

app.get('/hptable/:tableName', (req, res) => {
    const scopedb= mysql.createConnection({
        host:"193.203.168.40",
        user:"u758955658_root",
        password:"Faruk7093",
        database:"u758955658_recdo"
    })
    const tableName = req.params.tableName;
    console.log(tableName);
    scopedb.connect();

    const query = `SELECT * FROM ${tableName}hp ORDER BY Kod`;

  
    scopedb.query(query, (error, results, fields) => {
      if (error) {
        if(error.code==="ER_NO_SUCH_TABLE"){
            console.error('Tablo yok');

        }else{
            console.error('Error fetching data:', error);
            res.status(500).json({ error: error.sqlMessage, code:error.code });
            return;
        }
      }
      // Send the fetched data as JSON
      res.json(results);
    });
    scopedb.end()
  });
  app.get('/hptable/select/:tableName', (req, res) => {
    const scopedb = mysql.createConnection({
        host: "193.203.168.40",
        user: "u758955658_root",
        password: "Faruk7093",
        database: "u758955658_recdo"
    });

    const tableName = req.params.tableName;
    console.log(tableName);
    scopedb.connect();

    // Modify the query to retrieve only "Kod" and "Hesap_Adi" columns
    const query = `SELECT Kod, Hesap_Adi FROM ${tableName}hp ORDER BY Kod`;

    scopedb.query(query, (error, results, fields) => {
        if (error) {
            if (error.code === "ER_NO_SUCH_TABLE") {
                console.error('Tablo yok');
            } else {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: error.sqlMessage, code: error.code });
                return;
            }
        }
        // Send the fetched data as JSON
        res.json(results);
    });

    scopedb.end();
});

  app.post('/upload/from-bank-ekstre-hp', (req, res) => {
    const uid = req.body.uid;
    const { Kod, yeniDeger } = req.body;
    const scopedb = mysql.createConnection({
        host: "193.203.168.40",
        user: "u758955658_root",
        password: "Faruk7093",
        database: "u758955658_recdo"
    });

    scopedb.connect();
    const tableName = `${uid}hp`;

    // Check if the row with the given "Kod" exists
    const checkExistingRowSQL = `SELECT COUNT(*) AS count FROM ${tableName} WHERE Kod = ?`;

    scopedb.query(checkExistingRowSQL, [Kod], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking for existing row:', checkErr);
            res.status(500).send('Internal Server Error');
            scopedb.end();
        } else {
            const count = checkResult[0].count;

            if (count === 0) {
                // Row with the given "Kod" does not exist
                res.status(400).send('Row with the given Kod does not exist');
                scopedb.end();
            } else {
                // Row with the given "Kod" exists
                const columnName = String(yeniDeger).includes('-') ? 'alacak_tutari' : 'borc_tutari';

                // Update the appropriate column based on the presence of "-"
                const updateDegerSQL = `UPDATE ${tableName} SET ${columnName} = ${columnName} + ? WHERE Kod = ?`;

                scopedb.query(updateDegerSQL, [yeniDeger, Kod], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error(`Error updating ${columnName} column:`, updateErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        console.log(`${columnName} column updated successfully:`, updateResult);
                        res.status(200).send(`${columnName} column updated successfully`);
                    }

                    scopedb.end();
                });
            }
        }
    });
});


  app.post('/upload/yeni-kod', (req, res) => {
    const uid = req.body.uid;
    const { Kod, Hesap_Adi } = req.body;
    const scopedb = mysql.createConnection({
        host: "193.203.168.40",
        user: "u758955658_root",
        password: "Faruk7093",
        database: "u758955658_recdo"
    });

    scopedb.connect();
    const tableName = `${uid}hp`;
    const newData = [Kod, Hesap_Adi, '', -1, '', '', '', '', '', '', '', 0];

    // Check if a row with the given "Kod" already exists
    const checkExistingRowSQL = `SELECT COUNT(*) AS count FROM ${tableName} WHERE Kod = ?`;

    scopedb.query(checkExistingRowSQL, [Kod], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking for existing row:', checkErr);
            res.status(500).send('Internal Server Error');
        } else {
            const count = checkResult[0].count;

            if (count > 0) {
                // Row with the given "Kod" already exists
                res.status(400).send('Row with the given Kod already exists');
                scopedb.end();
            } else {
                // Row with the given "Kod" does not exist, insert new row
                const insertDataSQL = `INSERT INTO ${tableName} (Kod, Hesap_Adi, Column_3, Tipi, Stok_Kodu, Birim, Tck_Vkn, Cari, KDV_Hesap_Kodu, Tevkifat_Tür_Kodu, Column_11, Bakiye) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                // Execute the query to insert data into the dynamic table
                scopedb.query(insertDataSQL, newData, (insertErr, insertDataResult) => {
                    if (insertErr) {
                        console.error('Error inserting data into the dynamic table:', insertErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        console.log('Data inserted into the dynamic table:', insertDataResult);
                        res.status(200).send('Data inserted successfully');
                    }

                    scopedb.end();
                });
            }
        }
    });
});

  app.post('/upload/yeni-kod-sirali', (req, res) => {
    const uid = req.body.uid;
    const { Kod, Hesap_Adi, ExtraKod } = req.body;
    const scopedb = mysql.createConnection({
        host: "193.203.168.40",
        user: "u758955658_root",
        password: "Faruk7093",
        database: "u758955658_recdo"
    });

    scopedb.connect();

    const tableName = `${uid}hp`;
    const newData = [Kod, Hesap_Adi, '', -1, '', '', '', '', '', '', '', 0];

    // Check if ExtraKod exists in the table
    const checkExtraKodSQL = `SELECT * FROM ${tableName} WHERE Kod = ?`;

    scopedb.query(checkExtraKodSQL, [ExtraKod], (err, result) => {
        if (err) {
            console.error('Error checking for ExtraKod:', err);
            res.status(500).send('Internal Server Error');
        } else if (result.length === 0) {
            res.status(400).send('ExtraKod does not exist in the table');
        } else {
            // Get the row with Kod equal to ExtraKod
            const { Kod: extraKod } = result[0];

            // Insert the new row right below the row with Kod equal to ExtraKod
            const insertDataSQL = `
                INSERT INTO ${tableName} (Kod, Hesap_Adi, Column_3, Tipi, Stok_Kodu, Birim, Tck_Vkn, Cari, KDV_Hesap_Kodu, Tevkifat_Tür_Kodu, Column_11, Bakiye)
                SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                FROM ${tableName}
                WHERE Kod = ?
                ORDER BY Kod
                LIMIT 1;
            `;

            scopedb.query(insertDataSQL, [...newData, extraKod], (insertErr, insertDataResult) => {
                if (insertErr) {
                    console.error('Error inserting data into the dynamic table:', insertErr);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('Data inserted into the dynamic table:', insertDataResult);
                    res.status(200).send('Data inserted successfully');
                }

                // Close the connection after the query is executed
                scopedb.end();
            });
        }
    });
});



  app.post('/upload/ilk-hesap-tablosu', (req, res) => {
    const uid = req.body.uid;
    const data = req.body.data;
  
    const scopedb= mysql.createConnection({
        host:"193.203.168.40",
        user:"u758955658_root",
        password:"Faruk7093",
        database:"u758955658_recdo"
    })
    // Dynamic table name based on uid
    const tableName = `${uid}hp`;
    // Check if the table exists, if not, create it
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        Kod VARCHAR(15),
        Hesap_Adi VARCHAR(55),
        Column_3 VARCHAR(10),
        Tipi DOUBLE,
        Stok_Kodu VARCHAR(22),
        Birim VARCHAR(10),
        Tck_Vkn VARCHAR(11),
        Cari VARCHAR(10),
        KDV_Hesap_Kodu VARCHAR(10),
        Tevkifat_Tür_Kodu VARCHAR(10),
        Column_11 VARCHAR(10),
        Bakiye DOUBLE
      );      
    `;
    scopedb.connect();
    // Execute the query to create the table
    scopedb.query(createTableSQL, (err, createTableResult) => {
      if (err) {
        console.error('Error creating the table:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      console.log('Table created or already exists:', createTableResult);
  
      // Your SQL query to insert data into the dynamic table
      const insertDataSQL = `INSERT INTO ${tableName} (Kod,Hesap_Adi,Column_3,Tipi,Stok_Kodu,Birim,Tck_Vkn,Cari,KDV_Hesap_Kodu,Tevkifat_Tür_Kodu,Column_11,Bakiye) VALUES ('100','KASA','',-1,'','','','','','','',0),
      ('101','ALINAN ÇEKLER','',-1,'','','','','','','',0),
      ('102','BANKALAR','',-1,'','','','','','','',0),
      ('103','VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)','',-1,'','','','','','','',0),
      ('108','DİĞER HAZIR DEĞERLER','',-1,'','','','','','','',0),
      ('110','HİSSE SENETLERİ','',-1,'','','','','','','',0),
      ('111','ÖZEL KESİM TAHVİL, SENET VE BONOLARI','',-1,'','','','','','','',0),
      ('112','KAMU KESİMİ TAHVİL, SENET VE BONOLARI','',-1,'','','','','','','',0),
      ('118','DİĞER MENKUL KIYMETLER','',-1,'','','','','','','',0),
      ('119','MENKUL KIYMETLER DEĞ.DÜŞ.KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('120','ALICILAR','',-1,'','','','','','','',0),
      ('121','ALACAK SENETLERİ','',-1,'','','','','','','',0),
      ('122','ALACAK SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('124','KAZANILMAMIŞ FİNANSAL KİR. FAİZ GEL.(-)','',-1,'','','','','','','',0),
      ('126','VERİLEN DEPOZİTO VE TEMİNATLAR','',-1,'','','','','','','',0),
      ('127','DİĞER TİCARİ ALACAKLAR','',-1,'','','','','','','',0),
      ('128','ŞÜPHELİ TİCARİ ALACAKLAR','',-1,'','','','','','','',0),
      ('129','ŞÜPHELİ TİCARİ ALACAKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('131','ORTAKLARDAN ALACAKLAR','',-1,'','','','','','','',0),
      ('132','İŞTİRAKLERDEN ALACAKLAR','',-1,'','','','','','','',0),
      ('133','BAĞLI ORTAKLIKLARDAN ALACAKLAR','',-1,'','','','','','','',0),
      ('135','PERSONELDEN ALACAKLAR','',-1,'','','','','','','',0),
      ('136','DİĞER ÇEŞİTLİ ALACAKLAR','',-1,'','','','','','','',0),
      ('137','DİĞER ALACAK SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('138','ŞÜPHELİ DİĞER ALACAKLAR','',-1,'','','','','','','',0),
      ('139','ŞÜPHELİ DİĞER ALACAKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('150','İLK MADDE VE MALZEME','',-1,'','','','','','','',0),
      ('151','YARI MAMULLER - ÜRETİM','',-1,'','','','','','','',0),
      ('152','MAMULLER','',-1,'','','','','','','',0),
      ('153','TİCARİ MALLAR','',-1,'','','','','','','',0),
      ('157','DİĞER STOKLAR','',-1,'','','','','','','',0),
      ('158','STOK DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('159','VERİLEN SİPARİŞ AVANSLARI','',-1,'','','','','','','',0),
      ('170','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('171','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('172','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('173','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('174','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('175','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('176','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('177','YILLARA YAYGIN İNŞAAT VE ONARIM MLYT.','',-1,'','','','','','','',0),
      ('178','YILLARA YAYGIN İNŞAAT ENFLASYON DÜZ. HS.','',-1,'','','','','','','',0),
      ('179','TAŞERONLARA VERİLEN AVANSLAR','',-1,'','','','','','','',0),
      ('180','GELECEK AYLARA AİT GİDERLER','',-1,'','','','','','','',0),
      ('181','GELİR TAHAKKUKLARI','',-1,'','','','','','','',0),
      ('190','DEVREDEN KATMA DEĞER VERGİSİ','',-1,'','','','','','','',0),
      ('191','İNDİRİLECEK KDV','',-1,'','','','','','','',0),
      ('192','DİĞER KDV','',-1,'','','','','','','',0),
      ('193','PEŞİN ÖDENEN VERGİLER VE FONLAR','',-1,'','','','','','','',0),
      ('195','İŞ AVANSLARI','',-1,'','','','','','','',0),
      ('196','PERSONEL AVANSLARI','',-1,'','','','','','','',0),
      ('197','SAYIM VE TESLLÜM NOKSANLARI','',-1,'','','','','','','',0),
      ('198','DİĞER ÇEŞİTLİ DÖNEN VARLIKLAR','',-1,'','','','','','','',0),
      ('199','DİĞER DÖNEN VARLIKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('220','ALICILAR','',-1,'','','','','','','',0),
      ('221','ALACAK SENETLERİ','',-1,'','','','','','','',0),
      ('222','ALACAK SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('224','KAZANILMAMIŞ FİNANSAL KİR. FAİZ GEL.(-)','',-1,'','','','','','','',0),
      ('226','VERİLEN DEPOZİTO VE TEMİNATLAR','',-1,'','','','','','','',0),
      ('229','ŞÜPHELİ ALACAKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('231','ORTAKLARDAN ALACAKLAR','',-1,'','','','','','','',0),
      ('232','İŞTİRAKLERDEN ALACAKLAR','',-1,'','','','','','','',0),
      ('233','BAĞLI ORTAKLIKLARDAN ALACAKLAR','',-1,'','','','','','','',0),
      ('235','PERSONELDEN ALACAKLAR','',-1,'','','','','','','',0),
      ('236','DİĞER ÇEŞİTLİ ALACAKLAR','',-1,'','','','','','','',0),
      ('237','DİĞER ALACAK SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('239','ŞÜPHELİ DİĞER ALACAKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('240','BAĞLI MENKUL KIYMETLER','',-1,'','','','','','','',0),
      ('241','BAĞLI MENKUL KIYMETLER DEĞ.DÜŞ.KARŞ. (-)','',-1,'','','','','','','',0),
      ('242','İŞTİRAKLER','',-1,'','','','','','','',0),
      ('243','İŞTİRAKLERE SERMAYE TAAHÜTLERİ (-)','',-1,'','','','','','','',0),
      ('244','İŞTİRAKLER SERMAYE PAY.DEĞ.DÜŞ.KARŞ.(-)','',-1,'','','','','','','',0),
      ('245','BAĞLI ORTAKLIKLAR','',-1,'','','','','','','',0),
      ('246','BAĞLI ORTAKLIKLARA SERMAYE TAAHHÜT. (-)','',-1,'','','','','','','',0),
      ('247','BAĞLI ORTAKLIKLAR SER.PAY.DEĞ.DÜŞ.KR.(-)','',-1,'','','','','','','',0),
      ('248','DİĞER MALİ DURAN VARLIKLAR','',-1,'','','','','','','',0),
      ('249','DİĞER MALİ DURAN VARLIKLAR KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('250','ARAZİ VE ARSALAR','',-1,'','','','','','','',0),
      ('251','YERALTI VE YERÜSTÜ DÜZENLERİ','',-1,'','','','','','','',0),
      ('252','BİNALAR','',-1,'','','','','','','',0),
      ('253','TESİS, MAKİNE VE CİHAZLAR','',-1,'','','','','','','',0),
      ('254','TAŞITLAR','',-1,'','','','','','','',0),
      ('255','DEMİRBAŞLAR','',-1,'','','','','','','',0),
      ('256','DİĞER MADDİ DURAN VARLIKLAR','',-1,'','','','','','','',0),
      ('257','BİRİKMİŞ AMORTİSMANLAR (-)','',-1,'','','','','','','',0),
      ('258','YAPILMAKTA OLAN YATIRIMLAR','',-1,'','','','','','','',0),
      ('259','VERİLEN AVANSLAR','',-1,'','','','','','','',0),
      ('260','HAKLAR','',-1,'','','','','','','',0),
      ('261','ŞEREFİYE','',-1,'','','','','','','',0),
      ('262','KURULUŞ VE ÖRGÜTLENME GİDERLERİ','',-1,'','','','','','','',0),
      ('263','ARAŞTIRMA GELİŞTİRME GİDERLERİ','',-1,'','','','','','','',0),
      ('264','ÖZEL MALİYETLER','',-1,'','','','','','','',0),
      ('267','DİĞER MADDİ OLMAYAN DURAN VARLIKLAR','',-1,'','','','','','','',0),
      ('268','BİRİKMİŞ AMORTİSMANLAR (-)','',-1,'','','','','','','',0),
      ('269','VERİLEN AVANSLAR','',-1,'','','','','','','',0),
      ('271','ARAMA GİDERLERİ','',-1,'','','','','','','',0),
      ('272','HAZIRLIK VE GELİŞTİRME GİDERLERİ','',-1,'','','','','','','',0),
      ('277','ÖZEL TÜKENMEYE TABİ VARLIKLAR','',-1,'','','','','','','',0),
      ('278','BİRİKMİŞ TÜKENME PAYLARI (-)','',-1,'','','','','','','',0),
      ('279','VERİLEN AVANSLAR','',-1,'','','','','','','',0),
      ('280','GELECEK YILLARA AİT GİDERLER','',-1,'','','','','','','',0),
      ('281','GELİR TAHAKKUKLARI','',-1,'','','','','','','',0),
      ('291','GELECEK YILLARDA İNDİRİLECEK K.D.V.','',-1,'','','','','','','',0),
      ('292','DİĞER KATMA DEĞER VERGİSİ','',-1,'','','','','','','',0),
      ('293','GELECEK YILLAR İHTİYACI STOKLAR','',-1,'','','','','','','',0),
      ('294','ELDEN ÇIK. STOKLAR VE MADDİ DURAN VARL.','',-1,'','','','','','','',0),
      ('295','PEŞİN ÖDENEN VERGİLER VE FONLAR','',-1,'','','','','','','',0),
      ('296','GEÇİCİ HESAP','',-1,'','','','','','','',0),
      ('297','DİĞER ÇEŞİTLİ DURAN VARLIKLAR','',-1,'','','','','','','',0),
      ('298','STOK DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)','',-1,'','','','','','','',0),
      ('299','BİRİKMİŞ AMORTİSMANLAR (-)','',-1,'','','','','','','',0),
      ('300','BANKA KREDİLERİ','',-1,'','','','','','','',0),
      ('301','FİNANSAL KİRALAMA İŞLEMLERİNDEN BORÇLAR','',-1,'','','','','','','',0),
      ('302','ERTELENMİŞ FİN. KİR. BORÇLANMA MLYT. (-)','',-1,'','','','','','','',0),
      ('303','UZUN VD.KREDİ ANAPARA TAK. VE FAİZLERİ','',-1,'','','','','','','',0),
      ('304','TAHVİL ANAPARA BORÇ, TAKSİT VE FAİZLERİ','',-1,'','','','','','','',0),
      ('305','ÇIKARILMIŞ BONO VE SENETLER','',-1,'','','','','','','',0),
      ('306','ÇIKARILMIŞ DİĞER MENKUL KIYMETLER','',-1,'','','','','','','',0),
      ('308','MENKUL KIYMETLER İHRAÇ FARKI (-)','',-1,'','','','','','','',0),
      ('309','DİĞER MALİ BORÇLAR','',-1,'','','','','','','',0),
      ('320','SATICILAR','',-1,'','','','','','','',0),
      ('321','BORÇ SENETLERİ','',-1,'','','','','','','',0),
      ('322','BORÇ SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('326','ALINAN DEPOZİTO VE TEMİNATLAR','',-1,'','','','','','','',0),
      ('329','DİĞER TİCARİ BORÇLAR','',-1,'','','','','','','',0),
      ('331','ORTAKLARA BORÇLAR','',-1,'','','','','','','',0),
      ('332','İŞTİRAKLERE BORÇLAR','',-1,'','','','','','','',0),
      ('333','BAĞLI ORTAKLIKLARA BORÇLAR','',-1,'','','','','','','',0),
      ('335','PERSONELE BORÇLAR','',-1,'','','','','','','',0),
      ('336','DİĞER ÇEŞİTLİ BORÇLAR','',-1,'','','','','','','',0),
      ('337','DİĞER BORÇ SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('340','ALINAN SİPARİŞ AVANSLARI','',-1,'','','','','','','',0),
      ('349','ALINAN DİĞER AVANSLAR','',-1,'','','','','','','',0),
      ('350','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('351','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('352','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('353','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('354','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('355','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('356','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('357','YILLARA YAYGIN İNŞ.VE ONARIM HAKEDİŞ BD.','',-1,'','','','','','','',0),
      ('358','YILLARA YAYGIN İNŞAAT ENFLASYON DÜZ. HS.','',-1,'','','','','','','',0),
      ('360','ÖDENECEK VERGİ VE FONLAR','',-1,'','','','','','','',0),
      ('361','ÖDENECEK SOSYAL GÜVENLİK KESİNTİLERİ','',-1,'','','','','','','',0),
      ('368','VD.GEÇMİŞ,ERT.VEYA TAK. VERGİ VE DİĞ.YK.','',-1,'','','','','','','',0),
      ('369','ÖDENECEK DİĞER YÜKÜMLÜLÜKLER','',-1,'','','','','','','',0),
      ('370','DÖNEM KARI VERGİ VE DİĞ.YAS.YÜK.KAR.','',-1,'','','','','','','',0),
      ('371','DÖNEM KARI PŞ.ÖDENEN VER. VE DİĞ.YÜK.(-)','',-1,'','','','','','','',0),
      ('372','KIDEM TAZMİNATI KARŞILIĞI','',-1,'','','','','','','',0),
      ('373','MALİYET GİDERLERİ KARŞILIĞI','',-1,'','','','','','','',0),
      ('379','DİĞER BORÇ VE GİDER KARŞILIKLARI','',-1,'','','','','','','',0),
      ('380','GELECEK AYLARA AİT GELİRLER','',-1,'','','','','','','',0),
      ('381','GİDER TAHAKKUKLARI','',-1,'','','','','','','',0),
      ('391','HESAPLANAN K.D.V.','',-1,'','','','','','','',0),
      ('392','DİĞER K.D.V.','',-1,'','','','','','','',0),
      ('393','MERKEZ VE ŞUBELER CARİ HESABI','',-1,'','','','','','','',0),
      ('397','SAYIM VE TESELLÜM FAZLALARI','',-1,'','','','','','','',0),
      ('399','DİĞER ÇEŞİTLİ YABANCI KAYNAKLAR','',-1,'','','','','','','',0),
      ('400','BANKA KREDİLERİ','',-1,'','','','','','','',0),
      ('401','FİNANSAL KİRALAMA İŞLEMLERİNDEN BORÇLAR','',-1,'','','','','','','',0),
      ('402','ERTELENMİŞ FİN. KİR. BORÇLANMA MLYT. (-)','',-1,'','','','','','','',0),
      ('405','ÇIKARILMIŞ TAHVİLLER','',-1,'','','','','','','',0),
      ('407','ÇIKARILMIŞ DİĞER MENKUL KIYMETLER','',-1,'','','','','','','',0),
      ('408','MENKUL KIYMETLER İHRAÇ FARKI (-)','',-1,'','','','','','','',0),
      ('409','DİĞER MALİ BORÇLAR','',-1,'','','','','','','',0),
      ('420','SATICILAR','',-1,'','','','','','','',0),
      ('421','BORÇ SENETLERİ','',-1,'','','','','','','',0),
      ('422','BORÇ SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('426','ALINAN DEPOZİTO VE TEMİNATLAR','',-1,'','','','','','','',0),
      ('429','DİĞER TİCARİ BORÇLAR','',-1,'','','','','','','',0),
      ('431','ORTAKLARA BORÇLAR','',-1,'','','','','','','',0),
      ('432','İŞTİRAKLERE BORÇLAR','',-1,'','','','','','','',0),
      ('433','BAĞLI ORTAKLIKLARA BORÇLAR','',-1,'','','','','','','',0),
      ('436','DİĞER ÇEŞİTLİ BORÇLAR','',-1,'','','','','','','',0),
      ('437','DİĞER BORÇ SENETLERİ REESKONTU (-)','',-1,'','','','','','','',0),
      ('438','KAMUYA OLAN ERTELENMİŞ VEYA TAK. BORÇLAR','',-1,'','','','','','','',0),
      ('440','ALINAN SİPARİŞ AVANSLARI','',-1,'','','','','','','',0),
      ('449','ALINAN DİĞER AVANSLAR','',-1,'','','','','','','',0),
      ('472','KIDEM TAZMİNATI KARŞILIĞI','',-1,'','','','','','','',0),
      ('479','DİĞER BORÇ VE GİDER KARŞILIKLARI','',-1,'','','','','','','',0),
      ('480','GELECEK YILLARA AİT GELİRLER','',-1,'','','','','','','',0),
      ('481','GİDER TAHAKKUKLARI','',-1,'','','','','','','',0),
      ('492','GEL.YIL.ERTELENEN VEYA TERK.EDİLECEK KDV','',-1,'','','','','','','',0),
      ('493','TESİSE KATILMA PAYLARI','',-1,'','','','','','','',0),
      ('499','DİĞER UZUN VADELİ YABANCI KAYNAKLAR','',-1,'','','','','','','',0),
      ('500','SERMAYE','',-1,'','','','','','','',0),
      ('501','ÖDENMEMİŞ SERMAYE (-)','',-1,'','','','','','','',0),
      ('502','SERMAYE DÜZELTMESİ OLUMLU FARKLARI','',-1,'','','','','','','',0),
      ('503','SERMAYE DÜZELTMESİ OLUMSUZ FARKLARI (-)','',-1,'','','','','','','',0),
      ('520','HİSSE SENETLERİ İHRAÇ PRİMLERİ','',-1,'','','','','','','',0),
      ('521','HİSSE SENEDİ İPTAL KARLARI','',-1,'','','','','','','',0),
      ('522','M.D.V. YENİDEN DEĞERLEME ARTIŞLARI','',-1,'','','','','','','',0),
      ('523','İŞTİRAKLER YENİDEN DEĞERLEME ARTIŞLARI','',-1,'','','','','','','',0),
      ('524','MALİYET ARTIŞ FONU','',-1,'','','','','','','',0),
      ('525','KAYDA ALINAN EMTİA ÖZEL KARŞILIK HESABI','',-1,'','','','','','','',0),
      ('526','DEMİRBAŞ MAKİNE VE TECHİZAT ÖZEL KARŞILIK HESABI','',-1,'','','','','','','',0),
      ('529','DİĞER SERMAYE YEDEKLERİ','',-1,'','','','','','','',0),
      ('540','YASAL YEDEKLER','',-1,'','','','','','','',0),
      ('541','STATÜ YEDEKLERİ','',-1,'','','','','','','',0),
      ('542','OLAĞANÜSTÜ YEDEKLER','',-1,'','','','','','','',0),
      ('548','DİĞER KAR YEDEKLERİ','',-1,'','','','','','','',0),
      ('549','ÖZEL FONLAR','',-1,'','','','','','','',0),
      ('570','GEÇMİŞ YILLAR KARLARI','',-1,'','','','','','','',0),
      ('580','GEÇMİŞ YILLAR ZARARLARI (-)','',-1,'','','','','','','',0),
      ('590','DÖNEM NET KARI','',-1,'','','','','','','',0),
      ('591','DÖNEM NET ZARARI (-)','',-1,'','','','','','','',0),
      ('600','YURTİÇİ SATIŞLAR','',-1,'','','','','','','',0),
      ('601','YURTDIŞI SATIŞLAR','',-1,'','','','','','','',0),
      ('602','DİĞER GELİRLER','',-1,'','','','','','','',0),
      ('610','SATIŞTAN İADELER (-)','',-1,'','','','','','','',0),
      ('611','SATIŞ İSKONTOLARI (-)','',-1,'','','','','','','',0),
      ('612','DİĞER İNDİRİMLER','',-1,'','','','','','','',0),
      ('620','SATILAN MAMULLER MALİYETİ (-)','',-1,'','','','','','','',0),
      ('621','SATILAN TİCARİ MALLAR MALİYETİ (-)','',-1,'','','','','','','',0),
      ('622','SATILAN HİZMET MALİYETİ (-)','',-1,'','','','','','','',0),
      ('623','DİĞER SATIŞLARIN MALİYETİ (-)','',-1,'','','','','','','',0),
      ('630','ARAŞTIRMA VE GELİŞTİRME GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('631','PAZARLAMA, SATIŞ VE DAĞITIM GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('632','GENEL YÖNETİM GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('640','İŞTİRAKLERDEN TEMETTÜ GELİRLERİ','',-1,'','','','','','','',0),
      ('641','BAĞLI ORTAKLIKLARDAN TEMETTÜ GELİRLERİ','',-1,'','','','','','','',0),
      ('642','FAİZ GELİRLERİ','',-1,'','','','','','','',0),
      ('643','KOMİSYON GELİRLERİ','',-1,'','','','','','','',0),
      ('644','KONUSU KALMAYAN KARŞILIKLAR','',-1,'','','','','','','',0),
      ('645','MENKUL KIYMET SATIŞ KARLARI','',-1,'','','','','','','',0),
      ('646','KAMBİYO VE BORSA DEĞER ARTIŞ KARLARI','',-1,'','','','','','','',0),
      ('647','REESKONT FAİZ GELİRLERİ','',-1,'','','','','','','',0),
      ('648','ENFLASYON DÜZELTMESİ KARLARI','',-1,'','','','','','','',0),
      ('649','DİĞER OLAĞAN GELİR VE KARLAR','',-1,'','','','','','','',0),
      ('653','KOMİSYON GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('654','KARŞILIK GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('655','MENKUL KIYMET SATIŞ ZARARLARI (-)','',-1,'','','','','','','',0),
      ('656','KAMBİYO VE BORSA DEĞER AZAL ZARAR. (-)','',-1,'','','','','','','',0),
      ('657','REESKONT FAİZ GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('658','ENFLASYON DÜZELTMESİ ZARARLARI (-)','',-1,'','','','','','','',0),
      ('659','DİĞER GİDER VE ZARARLAR (-)','',-1,'','','','','','','',0),
      ('660','KISA VADELİ BORÇLANMA GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('661','UZUN VADELİ BORÇLANMA GİDERLERİ (-)','',-1,'','','','','','','',0),
      ('671','ÖNCEKİ DÖNEM GELİR VE KARLARI','',-1,'','','','','','','',0),
      ('679','DİĞER OLAĞANDIŞI GELİR VE KARLAR','',-1,'','','','','','','',0),
      ('680','ÇALIŞMAYAN KISIM GİDER VE ZARARLARI (-)','',-1,'','','','','','','',0),
      ('681','ÖNCEKİ DÖNEM GİDER VE ZARARLARI (-)','',-1,'','','','','','','',0),
      ('689','DİĞER OLAĞANDIŞI GİDER VE ZARARLAR (-)','',-1,'','','','','','','',0),
      ('690','DÖNEM KARI VEYA ZARARI','',-1,'','','','','','','',0),
      ('691','DÖNEM KARI VERGİ VE DİĞ.YAS.YÜK.KARŞ.(-)','',-1,'','','','','','','',0),
      ('692','DÖNEM NET KARI VEYA ZARARI','',-1,'','','','','','','',0),
      ('697','YILLARA YAYGIN İNŞAAT ENFLASYON DÜZ. HS.','',-1,'','','','','','','',0),
      ('698','ENFLASYON DÜZELTME HESABI','',-1,'','','','','','','',0),
      ('700','MALİYET MUHASEBESİ BAĞLANTI HESABI','',-1,'','','','','','','',0),
      ('701','MALİYET MUHASEBESİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('710','DİREKT İLKMADDE VE MALZEME GİDERLERİ','',-1,'','','','','','','',0),
      ('711','DİREKT İLKMADDE VE MALZEME YANSITMA HS.','',-1,'','','','','','','',0),
      ('712','DİREKT İLKMADDE VE MALZEME FİYAT FARKI','',-1,'','','','','','','',0),
      ('713','DİREKT İLKMADDE VE MALZEME MİKTAR FARKI','',-1,'','','','','','','',0),
      ('720','DİREKT İŞÇİLİK GİDERLERİ','',-1,'','','','','','','',0),
      ('721','DİREKT İŞÇİLİK YANSITMA HESABI','',-1,'','','','','','','',0),
      ('722','DİREKT İŞÇİLİK ÜCRET FARKLARI','',-1,'','','','','','','',0),
      ('723','DİREKT İŞÇİLİK ZAMAN FARKLARI','',-1,'','','','','','','',0),
      ('730','GENEL ÜRETİM GİDERLERİ','',-1,'','','','','','','',0),
      ('731','GENEL ÜRETİM GİDERLERİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('732','GENEL ÜRETİM GİDERLERİ BÜTÇE FARKLARI','',-1,'','','','','','','',0),
      ('733','GENEL ÜRETİM GİDERLERİ VERİMLİLİK FARK.','',-1,'','','','','','','',0),
      ('734','GENEL ÜRETİM GİDERLERİ KAPASİTE FARKLARI','',-1,'','','','','','','',0),
      ('740','HİZMET ÜRETİM MALİYETİ','',-1,'','','','','','','',0),
      ('741','HİZMET ÜRETİM MALİYETİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('742','HİZMET ÜRETİM MALİYETİ FARK HESAPLARI','',-1,'','','','','','','',0),
      ('750','ARAŞTIRMA GELİŞTİRME GİDERLERİ','',-1,'','','','','','','',0),
      ('751','ARAŞTIRMA GELİŞTİRME YANSITMA HESABI','',-1,'','','','','','','',0),
      ('752','ARAŞTIRMA GELİŞTİRME FARK HESAPLARI','',-1,'','','','','','','',0),
      ('760','PAZARLAMA, SATIŞ VE DAĞITIM GİDERLERİ','',-1,'','','','','','','',0),
      ('761','PAZARLAMA, SATIŞ VE DAĞITIM GİD.YANS.HS.','',-1,'','','','','','','',0),
      ('762','PAZARLAMA, SATIŞ VE DAĞITIM GİD.FARK HS.','',-1,'','','','','','','',0),
      ('770','GENEL YÖNETİM GİDERLERİ','',-1,'','','','','','','',0),
      ('771','GENEL YÖNETİM GİDERLERİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('772','GENEL YÖNETİM GİDER FARKLARI HESABI','',-1,'','','','','','','',0),
      ('780','FİNANSMAN GİDERLERİ','',-1,'','','','','','','',0),
      ('781','FİNANSMAN GİDERLERİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('782','FİNANSMAN GİDERLERİ FARK HESABI','',-1,'','','','','','','',0),
      ('790','İLKMADDE VE MALZEME HESAPLARI','',-1,'','','','','','','',0),
      ('791','İŞÇİ ÜCRET VE GİDERLERİ','',-1,'','','','','','','',0),
      ('792','MEMUR ÜCRET VE GİDERLERİ','',-1,'','','','','','','',0),
      ('793','DIŞARIDAN SAĞLANAN FAYDA VE HİZMETLER','',-1,'','','','','','','',0),
      ('794','ÇEŞİTLİ GİDERLER','',-1,'','','','','','','',0),
      ('795','VERGİ, RESİM VE HARÇLAR','',-1,'','','','','','','',0),
      ('796','AMORTİSMANLAR VE TÜKENME PAYLARI','',-1,'','','','','','','',0),
      ('797','FİNANSMAN GİDERLERİ','',-1,'','','','','','','',0),
      ('798','GİDER ÇEŞİTLERİ YANSITMA HESABI','',-1,'','','','','','','',0),
      ('799','ÜRETİM MALİYETİ HESABI','',-1,'','','','','','','',0),
      ('900','TEMİNAT MEKTUBUNDAN ALACAKLAR','',-1,'','','','','','','',0),
      ('901','TEMİNAT MEKTUBUNDAN BORÇLAR','',-1,'','','','','','','',0),
      ('910','ALINAN YATIRIM İNDİRİMLERİ','',-1,'','','','','','','',0),
      ('911','ALINAN YATIRIM İNDİRİMLERİ KARŞILIĞI','',-1,'','','','','','','',0),
      ('920','YATIRIM İND. KULLANILANLAR KARŞILIĞI','',-1,'','','','','','','',0),
      ('921','YATIRIM İNDİRİMİNDEN KULLANILANLAR','',-1,'','','','','','','',0),
      ('950','KANUNEN KABUL EDİLMEYEN GİDERLER','',-1,'','','','','','','',0),
      ('951','KANUNEN KABUL EDİLMEYEN GİDERLER KARŞ.','',-1,'','','','','','','',0),
      ('960','DİĞER İNDİRİMLER KARŞILIĞI','',-1,'','','','','','','',0),
      ('961','DİĞER İNDİRİMLER','',-1,'','','','','','','',0)`;
  
      // Execute the query to insert data into the dynamic table
      hostingerdb.query(insertDataSQL, [data], (err, insertDataResult) => {
        if (err) {
          console.error('Error inserting data into the dynamic table:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Data inserted into the dynamic table:', insertDataResult);
          res.status(200).send('Hesap planı başarıyla oluşturuldu');
        }
      });
    });
    scopedb.end()
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