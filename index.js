const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port=process.env.PORT||5000;

//middleware
app.use(cors())
app.use(express.json());

console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ggstth2.mongodb.net/?retryWrites=true&w=majority`;

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

    const serviceCollection=client.db('toyMarket').collection('services')
   
  app.get('/allToys',async(req,res)=>{
    const cursor=serviceCollection.find();
    const result=await cursor.limit(20).toArray();
    res.send(result)
  })

  
    app.get('/category/:category', async (req,res) => {
        const query = { category: `${req.params.category}` };
        const cursor = await serviceCollection.find(query).toArray();
        res.send(cursor)
    })
    
    // getting all toys by every toy id for every toy details
    app.get('/allToys/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result);
    })
    //all add toy
    app.get('/allAddToy', async(req, res) => {
      console.log(req.query.seller_email);
      let query = {};
      if(req.query.seller_email) {
          query = { seller_email: req.query.seller_email }
      }
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
  })

    app.post('/allAddToy', async(req, res) => {
      const body = req.body;
      console.log(body)
      const result = await serviceCollection.insertOne(body);
      res.send(result)
  })
  //searching
  app.get('/allAddToys/:text', async(req, res) => {
    const query = req.params.text;
    const result = await serviceCollection.find({
        $or: [
            { name: { $regex: query, $options: "i"}}
        ]
    }).toArray();
    
    res.send(result);
})

 // for delete
 app.delete('/allAddToy/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  const result = await serviceCollection.deleteOne(query);
  res.send(result);
})
//update
app.get('/allAddToy/:id',async(req,res)=>{
  const id=req.params.id;
  const query = { _id: new ObjectId(id) };
  const result=await serviceCollection.findOne(query);
  res.send(result);
})
//update
  app.put('/allAddToy/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const body = req.body;
        const updateToy = {
            $set: {
                price: body.price,
                quantity: body.quantity,
                description: body.description
            }
        }

        const result = await serviceCollection.updateOne( query, updateToy, options );
        res.send(result);
    })
    app.patch('/allAddToy/:id', async(req, res) => {
      const body = req.body;
      console.log(body);
  })
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('toy is running')

})
app.listen(port,()=>{
    console.log(`toy server is running in port ${port}`);
})