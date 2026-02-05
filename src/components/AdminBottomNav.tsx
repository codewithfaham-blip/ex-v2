"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, Users, ArrowDownCircle, ArrowUpCircle, Settings
} from "lucide-react";

export default function AdminBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <BarChart3 size={20} />, label: "Stats", href: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Users", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={20} />, label: "In", href: "/admin/dashboard/deposits" },
    { icon: <Settings size={20} />, label: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-2 py-3 z-[100] flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-all
              ${isActive ? "text-blue-500 scale-110" : "text-zinc-500"}
            `}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : ""}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
