const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqaks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();

        const database = client.db("TravelRide");
        const toursCollections = database.collection("Tours");
        const bookingsCollection = database.collection("Users");

        // GET TOUR API 
        app.get('/addTour', async (req, res) => {
            const cursor =  toursCollections.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });
        // GET BOOKING API 
        app.get('/bookings', async (req, res) => {
            const cursor =  bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // GET SINGLE BOOKING  
      app.get('/tourDetails/:id', async (req, res) => {
        const id = req.params.id;
        console.log('hitting single tour ',id);
        const query = {_id: ObjectId(id)};
        const tour = await toursCollections.findOne(query);
        res.json(tour);
      });

        // post tour api
        app.post('/addTour', async(req,res)=>{
            const tours = req.body;
            const result = await toursCollections.insertOne(tours);
            res.json(result);
        })

        // post BOOKING api
        app.post('/bookings', async(req,res)=>{
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings);
            res.json(result);
        })

        //DELETE API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            console.log(query,result);
            res.json(1);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Welcome to Travel Ride server');
});
app.listen(port, ()=>{
    console.log('Running on port: ', port);
});