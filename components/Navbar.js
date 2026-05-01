"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">TaskMatrix</h1>

      {/* Desktop */}
      <div className="hidden md:flex gap-4">
        <button>Dashboard</button>
        <button>Profile</button>
      </div>

      {/* Mobile Button */}
      <button onClick={() => setOpen(!open)} className="md:hidden">
        ☰
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black p-4 flex flex-col gap-3 md:hidden">
          <button>Dashboard</button>
          <button>Profile</button>
        </div>
      )}
    </div>
  );
}