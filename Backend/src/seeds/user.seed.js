import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
  // Female Users
  {
    email: "emily@email.com",
    fullName: "Emily",
    password: "123456",
  },
  {
    email: "freya@email.com",
    fullName: "Freya",
    password: "123456",
  },
  {
    email: "sophia@email.com",
    fullName: "Sophia",
    password: "123456",
  },
  {
    email: "millie@email.com",
    fullName: "Millie",
    password: "123456",
  },

  // Male Users
  {
    email: "jimmy@email.com",
    fullName: "Jimmy",
    password: "123456",
  },
  {
    email: "william@email.com",
    fullName: "William",
    password: "123456",
  },
  {
    email: "clark@email.com",
    fullName: "Clark",
    password: "123456",
  },
  {
    email: "henry@email.com",
    fullName: "Henry",
    password: "123456",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // First, clear existing users to avoid duplicate errors
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash passwords before inserting
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("123456", saltRounds);
    
    const usersWithHashedPasswords = seedUsers.map(user => ({
      ...user,
      password: hashedPassword
    }));

    await User.insertMany(usersWithHashedPasswords);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Call the function
seedDatabase();