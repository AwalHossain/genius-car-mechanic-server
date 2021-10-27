const express = require('express');
const app = express()
const  cors = require('cors')
const { MongoClient } = require('mongodb');
const port =process.env.PORT || 5000
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId; 
const { ObjectID } = require('bson');
//Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33slg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async  function run(){
    try{
      await client.connect()
      console.log('database connected');
      const database = client.db('mechanicDb');
      const mechanicCollection = database.collection('carMechanic')
    //   get api
    app.get('/service', async(req, res)=>{
        const cursor =  mechanicCollection.find({})
        const data = await cursor.toArray();
        res.send(data)
    })

    //Get sing data
    app.get('/service/:id', async(req, res)=>{
        const id = req.params.id
        console.log('getting specifice service', id);
        const query = {_id: ObjectId(id)}
        const singData = await mechanicCollection.findOne(query)
        res.json(singData)
    })

    // delete api
    app.delete('/service/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const result = await mechanicCollection.deleteOne(query)
        console.log("hitted", result);
        res.send(result)
    })

    //   post api
      app.post('/service',async(req, res)=>{
          const data = req.body;
        console.log("post hitted", data);
        const result = await mechanicCollection.insertOne(data)
        res.json(data);
      })

    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/hello',(req, res)=>{
    res.send("hello there!")
})

app.get('/', (req, res)=>{
    res.send("Genius car mechanic server")
})

app.listen(port, ()=>{
    console.log("listening server on", port);
})