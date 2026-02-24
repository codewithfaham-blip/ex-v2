"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, 
  Settings, LogOut, Menu, X, CreditCard, Database, Wallet, ArrowLeft
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/admin/dashboard" },
    { icon: <Users size={18} />, label: "Users", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={18} />, label: "Deposits", href: "/admin/dashboard/deposits" },
    { icon: <ArrowUpCircle size={18} />, label: "Withdrawals", href: "/admin/dashboard/withdrawals" },
    { icon: <CreditCard size={18} />, label: "Plans", href: "/admin/dashboard/plans" },
    { icon: <Wallet size={18} />, label: "Admin Wallet", href: "/admin/dashboard/wallet" },
    { icon: <Settings size={18} />, label: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Header - Only visible on small screens */}
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 z-[50] flex justify-between items-center">
        <Link href="/admin/dashboard">
          <BrandLogo size="sm" type="admin" />
        </Link>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-600 rounded-lg border border-purple-600/20 active:scale-90 transition-all shadow-[0_0_15px_rgba(147,51,234,0.1)]"
           >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
           </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ring-1 ring-purple-500/5
      `}>


        <div className="p-8">
          <Link href="/admin/dashboard" className="group" onClick={() => setIsOpen(false)}>
            <BrandLogo size="md" type="admin" />
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
                  ${isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
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
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <LogOut size={16} /> Exit Terminal
          </button>
        </div>
      </aside>
    </>
  );
}