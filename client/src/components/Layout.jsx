import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-8 pt-0 pb-8">
        {/* Top gradient bar containing header (bigger, rounded bottom like screenshots) */}
        <div className="rounded-b-lg mb-6" style={{ padding: '14px 18px', background: `linear-gradient(90deg, rgba(248,238,255,0.95), rgba(255,249,238,0.95))` }}>
          <Header />
        </div>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
