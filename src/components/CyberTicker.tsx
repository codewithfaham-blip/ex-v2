"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function CyberTicker() {
  const [prices, setPrices] = useState([
    { coin: "BTC", price: "42,394.12", change: "+1.2%", up: true },
    { coin: "ETH", price: "2,241.05", change: "-0.4%", up: false },
    { coin: "TON", price: "2.14", change: "+5.8%", up: true },
    { coin: "USDT", price: "1.00", change: "0.0%", up: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: (parseFloat(p.price.replace(',', '')) + (Math.random() - 0.5) * 2).toFixed(2),
        change: `${(Math.random() * 5).toFixed(1)}%`,
        up: Math.random() > 0.4
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap">
      {prices.map((p, i) => (
        <div key={i} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter italic">{p.coin}</span>
          <span className="text-[10px] font-bold text-white tracking-widest">${p.price}</span>
          <span className={`text-[8px] font-black ${p.up ? "text-emerald-500" : "text-red-500"}`}>
            {p.up ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
            {p.change}
          </span>
          {i !== prices.length - 1 && <div className="w-1 h-1 bg-zinc-800 rounded-full mx-2" />}
        </div>
      ))}
    </div>
  );
}
