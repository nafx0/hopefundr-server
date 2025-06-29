const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nafx.o5tohq0.mongodb.net/?retryWrites=true&w=majority&appName=nafx`;

let cachedClient = null;
let cachedDb = null;

async function connectToDB() {
  if (cachedDb && cachedClient) {
    return { db: cachedDb, client: cachedClient };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  cachedDb = client.db("hopeFundr");

  console.log("🔗 Connected to MongoDB (cached)");
  return { db: cachedDb, client: cachedClient };
}

app.get("/", (req, res) => {
  res.send("🚀 HopeFundr Server is running!");
});

app.get("/health", (req, res) => {
  res.status(200).send("✅ Server is healthy");
});

app.post("/campaigns", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const result = await db.collection("campaignsDB").insertOne(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.error("POST /campaigns error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/campaigns", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const campaigns = await db.collection("campaignsDB").find({}).toArray();
    res.send(campaigns);
  } catch (err) {
    console.error("GET /campaigns error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/campaigns/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid ID format");

  try {
    const { db } = await connectToDB();
    const campaign = await db
      .collection("campaignsDB")
      .findOne({ _id: new ObjectId(id) });

    if (!campaign) return res.status(404).send("Campaign not found");

    res.send(campaign);
  } catch (err) {
    console.error("GET /campaigns/:id error:", err);
    res.status(500).send("Internal server error");
  }
});

app.put("/campaigns/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid ID format");

  try {
    const { db } = await connectToDB();
    const result = await db
      .collection("campaignsDB")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    if (result.matchedCount === 0) return res.status(404).send("Not found");

    res.send(result);
  } catch (err) {
    console.error("PUT /campaigns/:id error:", err);
    res.status(500).send("Internal server error");
  }
});

app.delete("/campaigns/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid ID format");

  try {
    const { db } = await connectToDB();
    const result = await db
      .collection("campaignsDB")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).send("Campaign not found");

    res.send(result);
  } catch (err) {
    console.error("DELETE /campaigns/:id error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/campaigns/email/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const { db } = await connectToDB();
    const campaigns = await db
      .collection("campaignsDB")
      .find({ email })
      .toArray();

    if (campaigns.length === 0)
      return res.status(404).send("No campaigns for this email");

    res.send(campaigns);
  } catch (err) {
    console.error("GET /campaigns/email/:email error:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/donations", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const result = await db.collection("donationsDB").insertOne(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.error("POST /campaigns error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/donations", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const result = await db.collection("donationsDB").find({}).toArray();
    res.send(result);
  } catch (err) {
    console.error("DELETE /campaigns/:id error:", err);
    res.status(500).send("Internal server error");
  }
});


app.get("/donations/email/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const { db } = await connectToDB();
    const result = await db
      .collection("donationsDB")
      .find({ email })
      .toArray();

    if (!result.length) return res.status(404).send("No donations found");

    res.send(result);
  } catch (err) {
    console.error("GET /donations/email/:email error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/donations/campaign/:campaignId", async (req, res) => {
  const campaignId = req.params.campaignId;

  try {
    const { db } = await connectToDB();
    const result = await db
      .collection("donationsDB")
      .find({ campaignId }) // assuming campaignId is stored as a string
      .toArray();

    if (!result.length) return res.status(404).send("No donations for this campaign");

    res.send(result);
  } catch (err) {
    console.error("GET /donations/campaign/:campaignId error:", err);
    res.status(500).send("Internal server error");
  }
});



module.exports = app;
module.exports.handler = serverless(app);
