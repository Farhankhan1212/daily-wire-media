// Run with: npm run seed
// Creates the first admin account and a few default categories.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Category = require("../models/Category");

const defaultCategories = [
  "Technology",
  "Politics",
  "Business",
  "Sports",
  "Education",
  "Health",
  "Entertainment",
  "World News",
];

const run = async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "superadmin",
    });
    console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  for (const name of defaultCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) await Category.create({ name });
  }
  console.log("Default categories ensured.");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
