const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());
require("dotenv").config();


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nafx.o5tohq0.mongodb.net/?retryWrites=true&w=majority&appName=nafx`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("hopeFundr");
    const campaignsCollection = database.collection("campaignsDB");

    // Create a new campaign -- DONE
    app.post("/campaigns", async (req, res) => {
      const campaign = req.body;
      const result = await campaignsCollection.insertOne(campaign);
      res.send(result);
    });

    // Get all campaigns -- DONE
    app.get("/campaigns", async (req, res) => {
      const cursor = campaignsCollection.find({});
      const campaigns = await cursor.toArray();
      res.send(campaigns);
    });

    // Get a single campaign by ID -- DONE
    app.get("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) });
      res.send(campaign);
    });

    // Update a campaign by ID -- DONE
    app.put("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCampaign = req.body;
      const result = await campaignsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCampaign },
        { upsert: true }
      );
      if (result.modifiedCount > 0) {
        res.send(result);
      } else {
        res.status(404).send("Campaign not found");
      }
    });

    // Delete a campaign by ID -- DONE
    app.delete("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const result = await campaignsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        res.send(result)
      }
    });

    //Get campaigns by email -- DONE
    app.get("/campaigns/email/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = campaignsCollection.find({ email: email });
      const campaigns = await cursor.toArray();
      res.send(campaigns);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from HopeFundr Server!");
});

app.listen(port, () => {
  console.log(`HopeFundr Server is running on port: ${port}`);
});