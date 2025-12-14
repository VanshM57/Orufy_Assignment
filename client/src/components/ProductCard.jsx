import React from "react";
import { FaTrash } from "react-icons/fa";

export default function ProductCard({ product, onEdit, onDelete, onToggle, variant = "card" }) {
  const firstImage = product.images && product.images.length ? product.images[0] : "/uplistimage.jpg";

  if (variant === "wide") {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 w-full max-w-3xl mx-auto" style={{ boxShadow: "0 8px 24px rgba(17,24,39,0.06)" }}>
        <div className="h-56 rounded-xl bg-gray-50 flex items-center justify-center mb-4 p-6">
          <div className="bg-white rounded-md p-6 flex items-center justify-center">
            <img src={firstImage} alt={product.name} className="max-h-40 object-contain" />
          </div>
        </div>

        <h4 className="font-semibold text-lg mb-2">{product.name}</h4>

        <div className="text-sm text-gray-500 mb-3 grid grid-cols-2 gap-y-1">
          <div>Product type -</div><div className="text-right">{product.type}</div>
          <div>Quantity Stock -</div><div className="text-right">{product.stock}</div>
          <div>MRP-</div><div className="text-right">₹ {product.mrp}</div>
          <div>Selling Price -</div><div className="text-right">₹ {product.selling_price}</div>
          <div>Brand Name -</div><div className="text-right">{product.brand}</div>
          <div>Total Number of images -</div><div className="text-right">{product.images?.length || 0}</div>
          <div>Exchange Eligibility -</div><div className="text-right">{product.exchange ? "YES" : "NO"}</div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onToggle(product)}
            className={`px-6 py-2 rounded-full text-white text-sm shadow ${product.published ? "bg-green-500" : "bg-linear-to-r from-blue-700 to-blue-500"}`}
          >{product.published ? "Unpublish" : "Publish"}</button>

          <button onClick={() => onEdit(product)} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50">Edit</button>

          <button onClick={() => onDelete(product)} className="ml-auto p-2 rounded-md border text-gray-400 w-10 h-10 flex items-center justify-center">
            <FaTrash />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md" style={{ boxShadow: '0 8px 24px rgba(17,24,39,0.06)' }}>
      <div className="h-44 rounded-xl bg-gray-50 flex items-center justify-center mb-6 p-4 overflow-hidden relative">
        <div className="bg-white rounded-md p-6 flex items-center justify-center w-full h-full">
          <img src={firstImage} alt={product.name} className="max-h-36 object-contain" />
        </div>

        {/* pager pill overlapping bottom center */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <div className="bg-white px-3 py-1 rounded-full shadow flex gap-2 items-center">
            {(product.images?.slice(0,3) || [null]).map((_, i) => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-orange-300" : "bg-gray-200"}`}></span>
            ))}
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-base mb-3">{product.name}</h4>

      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <div className="flex justify-between"><span>Product type -</span><span>{product.type}</span></div>
        <div className="flex justify-between"><span>Quantity Stock -</span><span>{product.stock}</span></div>
        <div className="flex justify-between"><span>MRP-</span><span>₹ {product.mrp}</span></div>
        <div className="flex justify-between"><span>Selling Price -</span><span>₹ {product.selling_price}</span></div>
        <div className="flex justify-between"><span>Brand Name -</span><span>{product.brand}</span></div>
        <div className="flex justify-between"><span>Total Number of images -</span><span>{product.images?.length || 0}</span></div>
        <div className="flex justify-between"><span>Exchange Eligibility -</span><span>{product.exchange ? "YES" : "NO"}</span></div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => onToggle(product)}
          className={`px-6 py-2 rounded-full text-white text-sm shadow-md ${product.published ? "bg-green-500" : "bg-gradient-to-r from-blue-700 to-blue-500"}` }
          style={!product.published ? { boxShadow: 'inset 0 -6px 18px rgba(7,55,212,0.35)' } : {}}
        >
          {product.published ? "Unpublish" : "Publish"}
        </button>

        <button onClick={() => onEdit(product)} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50">Edit</button>

        <button onClick={() => onDelete(product)} className="ml-auto p-2 rounded-md border text-gray-400 w-10 h-10 flex items-center justify-center">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
