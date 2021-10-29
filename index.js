const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


// 
app.use(cors());
app.use(express.json())

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dywnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try{
    await client.connect();
    const database = client.db("SA-Travel");
    const dataCollection = database.collection("data");

    // get Api
    app.get('/services',async(req,res)=>{
      const cursol = dataCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let product
      const count = await cursol.count();
      if(page){
        product = await cursol.skip(page*size).limit(size).toArray();
      }
      else{
         product = await cursol.toArray();
      }
      
      res.send({
        count,
        product});
    });

        // POST API
        // app.post('/services',async(req,res)=>{
        //   const service = req.body;
        //   const result = await servicesCollection.insertOne(service);
        //   res.json(result)
        // })
  }
  finally{

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})