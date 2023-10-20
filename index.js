const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ojnnavp.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

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
    await client.connect();

    const productsCollection = client.db("fashionDB").collection("addproducts");
    const usersCollection = client.db("fashionDB").collection("users");

    // add products
    app.post('/addproducts', async (req, res) => {
      const product = req.body;
      console.log('new product', product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })
    // show products data
    app.get('/addproducts', async (req, res) => {
      const cursor = productsCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    // load update products
    app.get('/addproducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result);
    })
    // update product
    app.put('/addproducts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brandName: updateProduct.brandName,
          price: updateProduct.price,
          type: updateProduct.type,
          rating: updateProduct.rating,
          image: updateProduct.image

        }
      }
      const result = await productsCollection.updateOne(filter, product, options);
      res.send(result)

    })

    // add user 
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//middleware
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send("Simple CRUD is running soon");
})


app.listen(port, () => {
  console.log(`Simple CRUD is Running on Port: ${port}`);
})
