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

        app.get('/rooms', async (req, res) => {
            const cursor = databaseCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

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
          

 

//         //add list
//         app.post('/touristspots', async (req, res) => {
//             const formData= req.body;
//             console.log(formData);
//             const result = await touristSpotsCollection.insertOne(formData);
//             res.send(result);
//         })

//         // delete
//            app.delete('/touristspots/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id)}
//             const result = await touristSpotsCollection.deleteOne(query);
//             res.send(result);
//         })


//         // update
//         app.get('/touristspots/:id', async (req, res) => {
//             const id = req.params.id;
//             console.log(id);
//             const query = { _id: new ObjectId(id)  }
//             const result = await touristSpotsCollection.findOne(query);
//             res.send(result);
//         })



// app.put('/touristspots/:id', async (req, res) => {
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) }
//     const options = { upsert: true };
//     const spots = req.body;
//     const data = {
//       $set: {
//         image_url: spots.image_url,
//         tourists_spot_name: spots.tourists_spot_name,
//         country_name: spots.country_name,
//         location: spots.location,
//         short_description: spots.short_description,
//         average_cost: spots.average_cost,
//         seasonality: spots.seasonality,
//         travel_time: spots.travel_time,
//         total_visitors_per_year: spots.total_visitors_per_year,
//         user_name: spots.user_name, 
//         user_email: spots.user_email,
//       }
//     }
//     const result = await touristSpotsCollection.updateOne(filter, data, options);
//     res.send({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
//   })


    
        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('server running')
})

app.listen(port, ()=>{
    console.log(`Port:${port}`)
})


       //mylist
//         app.get("/touristspots/:email", async (req, res) => {
//           const email = req.params.email;
//            const query = { user_email: email };
//   const result = await touristSpotsCollection.find(query)
//   res.send(result);
//       });
      