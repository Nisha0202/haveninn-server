const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());
// app.use(cookieParser());

// const jwt = require('jsonwebtoken');
// const { parse } = require('dotenv');
// const cookieParser = require('cookie-parser');


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
//    const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//     };


// //creating Token
// app.post("/jwt", async (req, res) => {
//   const user = req.body;
//   console.log("user for token", user);
//   jwt.sign(user, process.env.SECRET_TOKEN,{
//         expiresIn:'7d'
//       })

//   res.cookie("token", token, cookieOptions).send({ success: true });
// });

// //clearing Token
// app.post("/logout", async (req, res) => {
//   const user = req.body;
//   console.log("logging out", user);
//   res
//     .clearCookie("token", { ...cookieOptions, maxAge: 0 })
//     .send({ success: true });
// });


    const databaseCollection = client.db('hotel').collection('rooms');

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

    // app.get('/rooms/user', async (req, res) => {
    //   const token = req.cookies?.token;
    //   console.log(token);
    //   if(token){
    //     jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    //       if(err){
    //         return console.log(err)
    //       }
    //       console.log(decoded);
    
    //       // Get the email from the decoded token
    //       const decodedEmail = decoded.email;
    
    //       // Get the email from the query parameters
    //       const { email } = req.query;
    
    //       // Match the emails
    //       if(decodedEmail === email) {
    //         let cursor = databaseCollection.find({ bookedEmail: email });
    //         cursor.toArray().then(result => {
    //           res.send(result);
    //         }).catch(error => {
    //           console.error('Error:', error);
    //           res.sendStatus(500);
    //         });
    //       } else {
    //         console.log('Emails do not match');
    //         res.sendStatus(403); // Forbidden
    //       }
    //     })
    //   } else {
    //     res.sendStatus(401); // Unauthorized
    //   }
    // });
    
    


    //reviews

    const reviewCollection = client.db('hotel').collection('reviews');
    
    // add
    app.post('/reviews', async (req, res) => {
      const review = req.body;
    
      try {
        await reviewCollection.insertOne(review);
        res.status(201).send('Review posted');
      } catch (error) {
        console.error('Failed to post review:', error);
        res.status(500).send('Failed to post review');
      }
    });

    // see
    app.get('/reviews', async (req, res) => {
      try {
        const reviews = await reviewCollection.find().toArray();
        res.status(200).json(reviews);
      } catch (error) {
        console.error('Failed to get reviews:', error);
        res.status(500).send('Failed to get reviews');
      }
    })

    //review on rooms
    app.get('/reviews/:id', async (req, res) => {
      const estateId = req.params.id;
  
      try {
        const reviews = await reviewCollection.find({ roomId: estateId }).toArray();
        res.status(200).json(reviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        res.status(500).send('Failed to fetch reviews');
      }
    });



    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server running')
})

app.listen(port, () => {
  console.log(`Port:${port}`)
})

