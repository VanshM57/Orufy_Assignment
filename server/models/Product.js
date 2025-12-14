const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"], 
    required: true 
  },
  stock: { type: Number, required: true },
  mrp: { type: Number, required: true },
  selling_price: { type: Number, required: true },
  brand: { type: String, required: true },
  exchange: { type: Boolean, default: false },

  // MULTIPLE IMAGES
  images: [{ type: String }],

  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
