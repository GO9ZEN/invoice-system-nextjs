"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex w-full md:h-16 h-12 items-center bg-black text-white flex-wrap">
      <div className="flex w-full justify-between md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px]">
        <Link href="/">
          <div className="flex gap-2 md:text-xl text-lg font-bold">
            <h1 className="text-red-500">Invoice</h1>
            <h1 className="text-blue-500">System</h1>
          </div>
        </Link>

        <div className="hidden md:flex gap-12 md:text-lg text-base font-semibold">
          <Link href="/invoices">
            <h1 className="hover:text-blue-500">Invoices</h1>
          </Link>
          <Link href="/expenses">
            <h1 className="hover:text-blue-500">Expenses</h1>
          </Link>
        </div>

        <div className="md:hidden flex gap-12 md:text-lg text-base font-semibold">
          <button className="hover:text-red-500" onClick={toggleNavbar}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-[220px] p-[30px] w-full bg-slate-950 z-50">
          <div className="flex items-center justify-center flex-col gap-6">
            <Link href="/invoices">
              <h1 className="hover:text-blue-500">Invoices</h1>
            </Link>
            {/* <Link href="/items">
              <h1 className="hover:text-blue-500">Items</h1>
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
}
