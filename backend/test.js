require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  try {
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ Connected:", conn.connection.host);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err);
    process.exit(1);
  }
})();