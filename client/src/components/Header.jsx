import React from "react";
import { FaSearch, FaTimes, FaHome } from "react-icons/fa";

import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { setSearchTerm, searchTerm } = useProducts();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // derive page title and appearance from path
  const path = loc.pathname;
  const isHome = path === "/" || path === "/home";
  const isProducts = path.startsWith("/products");

  useEffect(() => {
    // when navigating to home, clear search to match screenshots
    if (isHome) setSearchTerm("");
  }, [isHome]);

  // local input state with debounce so typing feels snappy
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const debounced = useRef(null);

  useEffect(() => {
    // update local input when external searchTerm changes (navigation)
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => setSearchTerm(inputValue), 300);
    return () => clearTimeout(debounced.current);
  }, [inputValue]);

  return (
    <header className="relative px-0 py-3 z-10">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 flex items-center gap-2 text-gray-600">
        <FaHome className="text-sm" />
        <div className="text-sm">{isHome ? "Home" : isProducts ? "Products" : ""}</div>
      </div>

      {/* Centered product-only search */}
      {isProducts && (
        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2">
          <div className="relative">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search Services, Products"
              aria-label="Search products"
              className={`pl-4 pr-12 w-[360px] md:w-[420px] lg:w-[520px] min-w-[280px] h-10 rounded-full bg-white/90 border border-gray-200 text-sm shadow-sm`} 
            />

            {inputValue && (
              <button onClick={() => { setInputValue(""); setSearchTerm(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border flex items-center justify-center text-gray-400 text-sm z-10">
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setOpen((s) => !s)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">U</button>
          {open && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 w-40">
              <button className="w-full text-left px-2 py-1 hover:bg-gray-50">Profile</button>
              <button onClick={logout} className="w-full text-left px-2 py-1 hover:bg-gray-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
