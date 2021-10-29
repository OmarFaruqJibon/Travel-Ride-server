const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

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
        const usersCollections = database.collection("Users");


        // GET TOUR API 
        app.get('/addTour', async (req, res) => {
            const cursor =  toursCollections.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });
        // GET USER API 
        app.get('/users', async (req, res) => {
            const cursor =  usersCollections.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // GET SINGLE SERVICE  
      app.get('/tourDetails/:id', async (req, res) => {
        const id = req.params.id;
        console.log('hitting single tour ',id);
        const query = {_id: ObjectId(id)};
        const tour = await toursCollections.findOne(query);
        res.json(tour);
      });


        // post tour api
        app.post('/addTour', async(req,res)=>{
            // console.log(req.body);
            const tours = req.body;
            const result = await toursCollections.insertOne(tours);
            res.json(result);
        })
        // post user api
        app.post('/users', async(req,res)=>{
            console.log('hitting user: ',req.body);
            const users = req.body;
            const result = await usersCollections.insertOne(users);
            res.json(result);
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