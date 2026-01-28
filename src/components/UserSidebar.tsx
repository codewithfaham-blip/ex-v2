"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Wallet, ArrowDownRight, ArrowUpLeft, 
  Users2, Settings, LogOut, Menu, X, Landmark
} from "lucide-react";
import Logo from "./Logo";

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Landmark size={18} />, label: "Investment Plans", href: "/dashboard/plans" },
    { icon: <ArrowDownRight size={18} />, label: "Deposit", href: "/dashboard/deposit" },
    { icon: <ArrowUpLeft size={18} />, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: <Users2 size={18} />, label: "Affiliates", href: "/dashboard/affiliates" },
    { icon: <Settings size={18} />, label: "Account Settings", href: "/dashboard/settings" },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 w-full bg-zinc-950 border-b border-zinc-900 p-4 z-[50] flex justify-between items-center">
        <span className="text-blue-500 font-black tracking-tighter italic text-lg">EXOTIC<span className="text-white">CASH</span></span>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 p-2 rounded-xl">
          {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
        </button>
      </div>

      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-black text-blue-600 tracking-tighter italic">
              EXOTIC<span className="text-white text-xs ml-1 uppercase tracking-[0.2em] font-bold">User</span>
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
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest
                  ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}
                `}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4 text-center">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <LogOut size={16} /> Secure Exit
          </button>
        </div>
      </aside>
    </>
  );
}