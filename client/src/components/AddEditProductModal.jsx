import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useProducts } from "../context/ProductContext";

const PRODUCT_TYPES = ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"];

export default function AddEditProductModal({ open, onClose, editing }) {
  const { addProduct, updateProduct } = useProducts();
  const [form, setForm] = useState({
    name: "",
    type: "",
    stock: "",
    mrp: "",
    selling_price: "",
    brand: "",
    exchange: "Yes",
    images: []
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        type: editing.type || "",
        stock: editing.stock || "",
        mrp: editing.mrp || "",
        selling_price: editing.selling_price || "",
        brand: editing.brand || "",
        exchange: editing.exchange ? "Yes" : "No",
        images: editing.images || []
      });
    } else {
      setForm({
        name: "",
        type: "",
        stock: "",
        mrp: "",
        selling_price: "",
        brand: "",
        exchange: "Yes",
        images: []
      });
    }
  }, [editing, open]);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    // append new files to existing selection
    setForm((f) => ({ ...f, images: [...(f.images || []), ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))] }));
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const fileInputRef = React.useRef();
  const openFileDialog = () => fileInputRef.current?.click();

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    const errs = {};
    if (!form.name) errs.name = "Required";
    if (!form.type) errs.type = "Required";
    if (!form.stock) errs.stock = "Required";
    if (!form.mrp) errs.mrp = "Required";
    if (!form.selling_price) errs.selling_price = "Required";
    if (!form.brand) errs.brand = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const data = new FormData();
    data.append("name", form.name);
    data.append("type", form.type);
    data.append("stock", form.stock);
    data.append("mrp", form.mrp);
    data.append("selling_price", form.selling_price);
    data.append("brand", form.brand);
    data.append("exchange", form.exchange === "Yes");

    // Images
    form.images.forEach((img) => {
      if (img.file) data.append("images", img.file);
      else if (typeof img === "string") data.append("existingImages", img);
    });

    try {
      setSubmitting(true);
      if (editing) {
        await updateProduct(editing._id, data);
      } else {
        await addProduct(data);
      }
      onClose(true);
    } catch (err) {
      alert("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={editing ? "Edit Product" : "Add Product"} open={open} onClose={() => onClose(false)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-600">Product Name</label>
          <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="mt-1" />
          {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
        </div>

        <div>
          <label className="text-xs text-gray-600">Product Type</label>
          <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="mt-1">
            <option value="">Select product type</option>
            {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <div className="text-xs text-red-500 mt-1">{errors.type}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">Quantity Stock</label>
            <input type="number" value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})} className="mt-1" />
            {errors.stock && <div className="text-xs text-red-500 mt-1">{errors.stock}</div>}
          </div>

          <div>
            <label className="text-xs text-gray-600">MRP</label>
            <input type="number" value={form.mrp} onChange={(e)=>setForm({...form, mrp:e.target.value})} className="mt-1" />
            {errors.mrp && <div className="text-xs text-red-500 mt-1">{errors.mrp}</div>}
          </div>

          <div>
            <label className="text-xs text-gray-600">Selling Price</label>
            <input type="number" value={form.selling_price} onChange={(e)=>setForm({...form, selling_price:e.target.value})} className="mt-1" />
            {errors.selling_price && <div className="text-xs text-red-500 mt-1">{errors.selling_price}</div>}
          </div>

          <div>
            <label className="text-xs text-gray-600">Brand Name</label>
            <input value={form.brand} onChange={(e)=>setForm({...form, brand:e.target.value})} className="mt-1" />
            {errors.brand && <div className="text-xs text-red-500 mt-1">{errors.brand}</div>}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600">Upload Product Images</label>

          <div className="mt-2 border-2 border-dashed rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">Enter Description</div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={openFileDialog} className="text-sm text-[#1e2a5c] font-medium">Add More Photos</button>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFile} />
            </div>
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {form.images?.map((img, i) => (
              <div key={i} className="relative">
                <img src={img.url || img} alt="preview" className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600">Exchange or return eligibility</label>
          <select value={form.exchange} onChange={(e)=>setForm({...form, exchange:e.target.value})} className="mt-1">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="flex items-center justify-end">
          <button type="button" onClick={() => onClose(false)} className="mr-3 px-4 py-2 rounded border">Cancel</button>
          <button type="submit" disabled={submitting} className={`px-4 py-2 rounded ${submitting ? "bg-gray-300 text-gray-500" : "bg-[#0B3BFF] text-white"}`}>{submitting ? "Saving..." : editing?"Update":"Create"}</button>
        </div>
      </form>
    </Modal>
  );
}
