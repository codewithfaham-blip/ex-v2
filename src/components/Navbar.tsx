"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const dashboardHref = (session?.user as any)?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
      <div className="flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-blue-600">
            EXOTIC<span className="text-white">CASH</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider">
          <Link href="#plans" className="text-zinc-400 hover:text-white transition">Plans</Link>
          <Link href="#features" className="text-zinc-400 hover:text-white transition">Features</Link>
          
          {isLoading ? (
            <Loader2 className="animate-spin text-zinc-500" size={18} />
          ) : session ? (
            <div className="flex items-center gap-6">
              <Link href={dashboardHref} className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-zinc-500 hover:text-red-500 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Exit
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-zinc-400 hover:text-white transition">Login</Link>
              <Link href="/register" className="bg-blue-600 px-6 py-2.5 rounded-lg text-white hover:bg-blue-700 transition">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 p-5 flex flex-col space-y-4 animate-in slide-in-from-top duration-200">
          <Link href="#plans" onClick={() => setIsOpen(false)} className="text-zinc-300 text-base font-medium">Investment Plans</Link>
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-zinc-300 text-base font-medium">Platform Features</Link>
          <div className="h-px bg-zinc-900" />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : session ? (
            <div className="flex flex-col gap-3">
              <Link 
                href={dashboardHref} 
                onClick={() => setIsOpen(false)}
                className="bg-blue-600/10 text-blue-500 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} /> Dashboard Terminal
              </Link>
              <button 
                onClick={() => { signOut(); setIsOpen(false); }}
                className="bg-red-500/5 text-red-500 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-red-500/10"
              >
                <LogOut size={18} /> Exit System
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-zinc-300 text-base">Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="bg-blue-600 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs text-white">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
