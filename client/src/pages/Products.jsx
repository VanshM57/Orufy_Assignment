import React, { useState } from "react";
import Layout from "../components/Layout";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import AddEditProductModal from "../components/AddEditProductModal";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

export default function Products() {
  const { products, loading, deleteProduct, togglePublish } = useProducts();
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, product: null });
  const [toast, setToast] = useState({ open: false, message: "" });

  const { filteredProducts } = useProducts();
  const unpublished = filteredProducts.filter((p) => !p.published);
  const published = filteredProducts.filter((p) => p.published);

  const handleDelete = async () => {
    try {
      await deleteProduct(confirm.product._id);
      setConfirm({ open: false, product: null });
      setToast({ open: true, message: "Product deleted" });
      setTimeout(() => setToast({ open: false, message: "" }), 2500);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleToggle = async (product) => {
    try {
      await togglePublish(product._id, !product.published);
      setToast({ open: true, message: product.published ? "Product unpublished" : "Product published" });
      setTimeout(() => setToast({ open: false, message: "" }), 2500);
    } catch (err) {
      alert("Failed to update");
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Products</h2>
          <div>
            <button onClick={() => { setOpenAdd(true); setEditing(null); }} className="bg-linear-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md">+ Add Products</button>
          </div>
        </div>

      {loading && <div>Loading...</div>}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <img src="/icons/empty.svg" alt="empty" className="mx-auto mb-4" />
          <div className="text-lg font-semibold">Feels a little empty over here...</div>
          <p className="text-gray-500 mb-4">You can create products without connecting store you can add products to store anytime</p>
          <button onClick={() => setOpenAdd(true)} className="bg-[#1e2a5c] text-white px-6 py-2 rounded">Add your Products</button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-3">Published</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {published.map((p) => (
                <ProductCard key={p._id} product={p} onEdit={(prod) => { setEditing(prod); setOpenAdd(true); }} onDelete={(prod) => setConfirm({ open: true, product: prod })} onToggle={handleToggle} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Unpublished</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unpublished.map((p) => (
                <ProductCard key={p._id} product={p} onEdit={(prod) => { setEditing(prod); setOpenAdd(true); }} onDelete={(prod) => setConfirm({ open: true, product: prod })} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        </div>
      )}

      </div>

      <AddEditProductModal open={openAdd} onClose={(saved) => { setOpenAdd(false); if (saved) setToast({ open: true, message: editing ? "Product updated" : "Product added Successfully" }); }} editing={editing} />

      <Modal title="Delete Product" open={confirm.open} onClose={() => setConfirm({ open: false, product: null })}>
        <p>Are you sure you really want to delete this Product " {confirm.product?.name} " ?</p>
        <div className="text-right mt-4">
          <button onClick={() => setConfirm({ open: false, product: null })} className="mr-3 px-3 py-1 rounded border">Cancel</button>
          <button onClick={handleDelete} className="bg-blue-700 text-white px-3 py-1 rounded">Delete</button>
        </div>
      </Modal>

      <Toast message={toast.message} open={toast.open} onClose={() => setToast({ open: false, message: "" })} />
    </Layout>
  );
}
