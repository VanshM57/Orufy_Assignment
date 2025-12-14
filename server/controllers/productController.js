const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.path) || [];

    const product = await Product.create({
      ...req.body,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT (MERGE IMAGES)
exports.updateProduct = async (req, res) => {
  try {
    let images = req.body.existingImages || [];

    if (typeof images === "string") images = [images];

    if (req.files?.length) {
      images = [...images, ...req.files.map((f) => f.path)];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET PRODUCTS
exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

// TOGGLE PUBLISH
exports.togglePublish = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.published = !product.published;
  await product.save();
  res.json(product);
};
