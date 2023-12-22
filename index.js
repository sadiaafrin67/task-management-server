const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  }
  
  // middleware
  app.use(cors(corsOptions));
  app.use(express.json());

// user= taskUser
// pass= M3DcEkB0JPdYG9W9
// const uri = "mongodb+srv://<username>:<password>@cluster0.mnum3sy.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb+srv://taskUser:M3DcEkB0JPdYG9W9@cluster0.mnum3sy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const taskCollection = client.db("taskManagement").collection("tasks");

    // for get task
    app.get('/tasks', async (req, res) => {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // for get specific task
    app.get('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(query);
        res.send(result)
    })

    // for show on ui
    app.post('/tasks', async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result)
    })

    // for delete specific one
    app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })


    // for update specific one
    app.put('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedTask = req.body;
        console.log(updatedTask);
        const task = {
            $set: {
                title: updatedTask.title,
                description: updatedTask.description,
                deadline: updatedTask.deadline,
                priority: updatedTask.priority
            },
        }
        const result = await taskCollection.updateOne(filter, task, options);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








  app.get('/', (req, res) => {
    res.send('task management is running')
  })


  app.listen(port, () => {
    console.log(`task management server is running on port ${port}`)
  })