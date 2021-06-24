const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
const port = 6000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifnyo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const databaseCollection = client.db("volunteerNetwork").collection("activities");

  app.post("/addActicities", (req, res) => {
      const acticitie = req.body;
      console.log(acticitie);
      databaseCollection.insertMany(acticitie)
      .then(result => {
          console.log(result);
      })
  })

  app.get("/acticities", (req, res) => {
      const activities = databaseCollection.find()
      .toArray((err, document) => {
          res.send(document)
      })
  })

  app.get("/acticitie/:id", (req, res) => {
    //const id = req.params.id
    const data = databaseCollection.find({id:req.params.id})
    .toArray((err, document) => {
        res.send(document)
    })
})

});




client.connect(err => {
    const registeredActivitiesCollection = client.db("volunteerNetwork").collection("registeredActivities");
  
    app.post("/addRegisteredActivities", (req, res) => {
        const registeredActivities = req.body;
        console.log(registeredActivities);
        registeredActivitiesCollection.insertOne(registeredActivities)
        .then(result => {
            console.log("data added successdully");
            res.redirect('http://localhost:3000/registeredActivities') 
        })
    })


    app.get("/registeredActivities", (req, res) => {
        registeredActivitiesCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })


    app.delete("/delete/:id", ( req, res) => {
        registeredActivitiesCollection.deleteOne({_id:ObjectID(req.params.id)})
        .then(result => {
            res.send("succes")
        })
    })


  });


app.listen(process.env.PORT || port)