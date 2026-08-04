require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Campaign = require("./src/models/Campaign");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/sendhub")
  .then(async () => {
    console.log("Connected to DB");
    const result = await Campaign.updateMany(
      { status: "Running" },
      { status: "Draft" },
    );
    console.log(`Reset ${result.modifiedCount} stuck campaigns to Draft.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
