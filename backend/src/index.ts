import express from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
app.use(json());

const prisma = new PrismaClient();

app.listen(3000, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }

  console.log("Server is running on port 3000");
});
