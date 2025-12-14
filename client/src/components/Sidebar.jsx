import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBoxOpen } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-white p-4 hidden md:block">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">●</div>
          <span className="font-bold text-lg">Productr</span>
        </div>
      </div>

      <div className="mb-6">
        <input
          placeholder="Search"
          className="w-full px-3 py-2 rounded bg-[#0f1720] text-sm placeholder:text-gray-300"
        />
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded ${isActive ? "bg-[#1f2937]" : "hover:bg-[#1f2937]"}`
          }
        >
          <FaHome /> <span>Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded ${isActive ? "bg-[#1f2937]" : "hover:bg-[#1f2937]"}`
          }
        >
          <FaBoxOpen /> <span>Products</span>
        </NavLink>
      </nav>
    </aside>
  );
}
