require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server & Postman
    if (!origin) return callback(null, true);

    if (origin === CLIENT_URL) {
      return callback(null, origin);
    }

    return callback(new Error("Not allowed by CORS"));
  },
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