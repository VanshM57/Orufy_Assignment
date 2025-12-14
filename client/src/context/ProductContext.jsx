import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unpublished"); // published | unpublished
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q)
    );
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    // data is FormData
    const res = await api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProducts((prev) => [...prev, res.data]);
  };

  const updateProduct = async (id, data) => {
    const res = await api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? res.data : p))
    );
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const togglePublish = async (id, publish) => {
    // server exposes PUT /products/:id/toggle
    const res = await api.put(`/products/${id}/toggle`, { publish });
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? res.data : p))
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublish,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
