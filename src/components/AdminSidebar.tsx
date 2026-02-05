"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, 
  Settings, LogOut, Menu, X, CreditCard, Database, Wallet
} from "lucide-react";
import Logo from "./Logo";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/admin/dashboard" },
    { icon: <Users size={18} />, label: "Investors", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={18} />, label: "Deposits", href: "/admin/dashboard/deposits" },
    { icon: <ArrowUpCircle size={18} />, label: "Withdrawals", href: "/admin/dashboard/withdrawals" },
    { icon: <CreditCard size={18} />, label: "Plans", href: "/admin/dashboard/plans" },
    { icon: <Wallet size={18} />, label: "Admin Wallet", href: "/admin/dashboard/wallet" },
    { icon: <Settings size={18} />, label: "Settings", href: "/admin/dashboard/settings" },
    { icon: <Database size={18} />, label: "Railway DB", href: "/admin/dashboard/railway" },
  ];

  return (
    <>
      {/* Mobile Header - Only visible on small screens */}
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-6 py-4 z-[50] flex justify-between items-center">
        <span className="text-xl font-black tracking-tighter italic text-blue-600">EXOTIC<span className="text-white">ADMIN</span></span>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Secure</span>
        </div>
      </div>

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className="p-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <Logo className="w-9 h-9 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-black text-blue-600 tracking-tighter italic">
              EXOTIC<span className="text-white text-[10px] ml-1.5 uppercase tracking-[0.3em] font-bold">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest
                  ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4 text-center">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <LogOut size={16} /> Exit Terminal
          </button>
        </div>
      </aside>
    </>
  );
}