const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());

//CONNECT WITH MONGO DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hb6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("team_project");
    const procductCollection = database.collection("products");
    const trendingCollection = database.collection("trending");
    const wishlistCollection = database.collection("wishlist");
    const cartCollection = database.collection("cart");

    //GET DATA FROM DATABASE
    app.get("/trending", async (req, res) => {
      const cursor = trendingCollection.find({});
      const trending = await cursor.toArray();
      res.send(trending);
    });

    app.get("/products", async (req, res) => {
      const cursor = procductCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const cartProducts = await cursor.toArray();
      res.send(cartProducts);
    });
    app.get("/wishlist", async (req, res) => {
      const cursor = wishlistCollection.find({});
      const wishlisttProducts = await cursor.toArray();
      res.send(wishlisttProducts);
    });

    //SEND DATA IN DATABASE
    app.post("/wishlist", async (req, res) => {
      const wishlist = req.body;
      const result = await wishlistCollection.insertOne(wishlist);
      res.json(result);
    });
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.json(result);
    });

    //DELETE A SINGLE DATA FROM DATABSE

    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wishlistCollection.deleteOne(query);
      res.json(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from e-commarce site!");
});

app.listen(port, () => {
  console.log(`Listening at${port}`);
});
