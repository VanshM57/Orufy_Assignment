const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const auth = require("../middlewares/authMiddleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
  getProducts,
} = require("../controllers/productController");

router.get("/", auth, getProducts);

router.post(
  "/",
  auth,
  upload.array("images", 10), // 🔑 MUST MATCH FRONTEND
  createProduct
);

router.put(
  "/:id",
  auth,
  upload.array("images", 10),
  updateProduct
);

router.put("/:id/toggle", auth, togglePublish);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
