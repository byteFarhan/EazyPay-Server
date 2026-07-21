// import blogs from "./data/blogs.json";
const blogs = require("./data/blogs.json");
const books = require("./data/books.json");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thw2q4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("EazyPay");
const users_collection = database.collection("users");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //GET :: get all user data from users Collection in DB
    app.get("/users", async (req, res) => {
      const result = await users_collection.find().toArray();
      res.send(result);
    });

    //GET :: get single user data from users Collection in DB
    app.get("/user/:email", async (req, res) => {
      //   const email = req?.params?.email || "";
      let query = {};
      if (req?.params?.email) {
        query = { email: req?.params?.email };
      }
      const result = await users_collection.findOne(query);
      res.send(result);
    });

    //POST :: post single user data to users Collection in DB
    app.post("/users", async (req, res) => {
      const user = req.body;
      //   console.log("user", user);
      //   const query = { email: user.email, phoneNum: user.phoneNum };
      const query = { email: user.email };
      const isUserExist = await users_collection.findOne(query);
      console.log(isUserExist);
      if (isUserExist) {
        return res.send({ message: "user already exists!", insertedId: null });
      }
      const result = await users_collection.insertOne(user);
      res.send(result);
    });

    //GET :: get single user data to users Collection in DB

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/blogs", (req, res) => {
  // res.send("EazyPay Server is running...");
  res.send(blogs);
});
app.get("/books", (req, res) => {
  // res.send("EazyPay Server is running...");
  res.send(books);
});
app.get("/", (req, res) => {
  res.send("EazyPay Server is running...");
});
app.listen(port, () => {
  console.log(`EazyPay Server is running on port ${port}`);
});
