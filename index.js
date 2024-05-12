const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.5cua0xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const ObjectId = require('mongodb').ObjectId;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


//form things- 
async function run() {

  try {

    const databaseCollection = client.db('hotel').collection('rooms');

    // //showing
    // app.get('/rooms', async (req, res) => {
    //     const cursor = databaseCollection.find();
    //     const result = await cursor.toArray();
    //     res.send(result);
    // })

    //update status when booking
    app.put('/rooms/:id', async (req, res) => {
      const { id } = req.params;
      const updatedEstate = req.body;
      try {
        await databaseCollection.updateOne({ id }, { $set: updatedEstate });
        res.sendStatus(200);
      } catch (error) {
        console.error('Failed to update room:', error);
        res.sendStatus(500);
      }
    });

    // Showing or sorting
    app.get('/rooms', async (req, res) => {
      const { sort } = req.query;
      let cursor;
      if (sort === 'price') {
        cursor = databaseCollection.find().sort({ price: 1 });
      } else {
        cursor = databaseCollection.find();
      }
      const result = await cursor.toArray();
      res.send(result);
    });

    //user booked data
    app.get('/rooms/user', async (req, res) => {
      const { email } = req.query;
      let cursor = databaseCollection.find({ bookedEmail: email });
      const result = await cursor.toArray();
      res.send(result);
    });
    


  


    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server running')
})

app.listen(port, () => {
  console.log(`Port:${port}`)
})

