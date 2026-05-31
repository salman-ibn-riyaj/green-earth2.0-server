// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const port = process.env.PORT;
// app.use(cors());
// app.use(express.json());

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = process.env.MONGODB_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();

//     const database = client.db("greenEarth");
//     const treesCollection = database.collection("trees");

//     // Route
//     app.get("/trees", async (req, res) => {
//       try {
//         const trees = await treesCollection.find().toArray();
//         res.json(trees);
//       } catch (error) {
//         res.status(500).json({ message: "Server error" });
//       }
//     });

//     // Express.js backend
//     app.post("/api/update-profile", async (req, res) => {
//       const { id, name, image } = req.body;

//       try {
//         // ObjectId চেক করুন (যদি আপনার ডাটাবেস ObjectId ব্যবহার করে)
//         const result = await db
//           .collection("user")
//           .updateOne(
//             { _id: new ObjectId(id) },
//             { $set: { name, image, updatedAt: new Date() } },
//           );

//         if (result.matchedCount === 0) {
//           return res
//             .status(404)
//             .json({ success: false, message: "User not found" });
//         }

//         res.json({ success: true });
//       } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//       }
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );
//   } finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// ObjectId ইমপোর্ট করুন
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // ডাটাবেস এবং কালেকশন রেফারেন্স
    const database = client.db("greenEarth");
    const treesCollection = database.collection("trees");
    const usersCollection = database.collection("user"); // এখানে db.collection এর বদলে এটি ব্যবহার করবেন

    // Route
    app.get("/trees", async (req, res) => {
      try {
        const trees = await treesCollection.find().toArray();
        res.json(trees);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    // Profile update route
    app.post("/api/update-profile", async (req, res) => {
      const { id, name, image } = req.body;

      try {
        // এখানে usersCollection ব্যবহার করা হয়েছে
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { name, image, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});