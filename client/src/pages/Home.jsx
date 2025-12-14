import React, { useState } from "react";
import Layout from "../components/Layout";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import AddEditProductModal from "../components/AddEditProductModal";


function Home() {
  const { filteredProducts, loading, activeTab, setActiveTab, deleteProduct, togglePublish } = useProducts();
  const [confirm, setConfirm] = useState({ open: false, product: null });
  const [toast, setToast] = useState({ open: false, message: "" });
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const published = filteredProducts.filter((p) => p.published);
  const unpublished = filteredProducts.filter((p) => !p.published);

  const handleDelete = async () => {
    try {
      await deleteProduct(confirm.product._id);
      setToast({ open: true, message: "Product deleted" });
      setConfirm({ open: false, product: null });
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
      alert("Failed to update" );
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-start mb-4">
          <div className="flex gap-4">
            <button className={`pb-2 text-sm ${activeTab === "published" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`} onClick={() => setActiveTab("published")}>Published</button>
            <button className={`pb-2 text-sm ${activeTab === "unpublished" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`} onClick={() => setActiveTab("unpublished")}>Unpublished</button>
          </div>
        </div>

          {loading && <div>Loading...</div>}

          {!loading && activeTab === "published" && published.length === 0 && (
            <div className="text-center py-12">
              <img src="/icons/empty.svg" alt="empty" className="mx-auto mb-4 w-16 h-16" />
              <div className="text-2xl font-semibold mb-2">No Published Products</div>
              <p className="text-gray-500">Your Published Products will appear here<br/>Create your first product to publish</p>
            </div>
          )}

          {!loading && activeTab === "published" && published.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {published.map((p) => (
                <ProductCard key={p._id} product={p} onEdit={(prod) => { setEditing(prod); setOpenAdd(true); }} onDelete={(prod) => setConfirm({ open: true, product: prod })} onToggle={handleToggle} />
              ))}
            </div>
          )}

          {!loading && activeTab === "unpublished" && unpublished.length === 0 && (
            <div className="text-center py-12">
              <img src="/icons/empty.svg" alt="empty" className="mx-auto mb-4 w-16 h-16" />
              <div className="text-2xl font-semibold mb-2">No Unpublished Products</div>
              <p className="text-gray-500">Your Unpublished Products will appear here</p>
            </div>
          )}

          {!loading && activeTab === "unpublished" && unpublished.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unpublished.map((p) => (
                <ProductCard key={p._id} product={p} onEdit={(prod) => { setEditing(prod); setOpenAdd(true); }} onDelete={(prod) => setConfirm({ open: true, product: prod })} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </div>

        <Modal title="Delete Product" open={confirm.open} onClose={() => setConfirm({ open: false, product: null })}>
          <p>Are you sure you really want to delete this Product "{confirm.product?.name}" ?</p>
          <div className="text-right mt-4">
            <button onClick={() => setConfirm({ open: false, product: null })} className="mr-3 px-3 py-1 rounded border">Cancel</button>
            <button onClick={handleDelete} className="bg-blue-700 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </Modal>

        <Toast message={toast.message} open={toast.open} onClose={() => setToast({ open: false, message: "" })} />
        <AddEditProductModal open={openAdd} onClose={(saved) => { setOpenAdd(false); setEditing(null); if (saved) setToast({ open: true, message: editing ? "Product updated" : "Product added Successfully" }); }} editing={editing} />
    </Layout>
  );
}

export default Home;