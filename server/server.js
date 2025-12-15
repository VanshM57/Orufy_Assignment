require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// 🔑 IMPORTANT: credentials: true
app.use(cors({
  origin: "https://vercel.com/vansh-mishras-projects/orufy-assignment-zz19/",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // ✅ ADD THIS

let isConnected = false;
async function connectToDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}


app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToDB();
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(console.error);

// app.listen(process.env.PORT, () =>
//   console.log("Server running on", process.env.PORT)
// );

module.exports = app;