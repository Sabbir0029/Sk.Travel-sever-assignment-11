const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


// 
app.use(cors());
app.use(express.json())

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dywnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try{
    await client.connect();
    const database = client.db("SA-Travel");
    const dataCollection = database.collection("data");
    const dataHome = database.collection('HomeServices');

    // get Api
    app.get('/services',async(req,res)=>{
      const cursol = dataCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let services
      const count = await cursol.count();
      if(page){
        services = await cursol.skip(page*size).limit(size).toArray();
      }
      else{
        services = await cursol.toArray();
      }
      
      res.send({
        count,
        services});
    });

    app.get('/Homeservices/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const service = await dataHome.findOne(query)
      res.send(service);
    })

    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const service = await dataCollection.findOne(query)
      res.send(service);
    })

    app.get('/Homeservices', async (req, res)=>{
      const data = dataHome.find({})
      const services = await data.limit(6).toArray()
      res.send(services)
    })
    // POST API
    app.post('/bookinginfo', async(req,res)=>{
      const info = req.body;
      const result = await dataCollection.insertOne(info);
      res.json(result)
    });
  }
  finally{

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hello', (req, res) => {
  res.send('Hello Hello Hello  World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})