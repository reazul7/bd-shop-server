const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 5050
require('dotenv').config()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ae7d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log(err)
  const shareeCollection = client.db("bd-shop").collection("products");
  const orderCollection = client.db("bd-shop").collection("orders");
  console.log('Database Connected!!')
  
  app.post('/addProduct', (req,res)=>{
    const newSharee = req.body;
    shareeCollection.insertOne(newSharee)
    .then(result => {
      res.send(result.insertedCount>0)
    })
  })

  app.get('/product',(req, res) =>{
    shareeCollection.find()
    .toArray((err, sharee) => {
      res.send(sharee)
    })
  })
  app.get('/manage',(req,res)=>{
    shareeCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.get('/product/:id', (req,res) => {
    const id = ObjectId(req.params.id)
    shareeCollection.find({_id:id})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
})
  app.delete('/delete/:id',(req, res)=>{
    const id = ObjectId(req.params.id)
    shareeCollection.deleteOne({_id:id})
    .then(documents => res.send(documents.deletedCount>0) )
  })

  app.post('/addOrder', (req,res)=>{
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount>0)
    })
  })
  app.get('/order',(req, res) =>{
    console.log('clicked')
    orderCollection.find({})
    .toArray((err,documents) => {
      console.log(documents);
      res.send(documents)
    })
  })
});

app.get('/', (req, res) => {
  res.send('Hello Team Programming Hero!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})