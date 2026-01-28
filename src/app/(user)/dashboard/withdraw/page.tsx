"use client";

import React from "react";
import { ArrowUpLeft, ShieldCheck, AlertCircle, Coins, Clock } from "lucide-react";

// 1. Function ka naam hamesha Capital rakhein (WithdrawPage)
// 2. "export default" lazmi likhein
export default function WithdrawPage() {
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const availableBalance = 1250.00;

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
          Funds <span className="text-red-500 text-6xl">Extraction</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
          Request profit settlement to your external wallet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-emerald-500/10 p-3 rounded-2xl">
                  <Coins className="text-emerald-500" size={24} />
               </div>
               <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Withdrawable Liquidity</p>
                  <h3 className="text-3xl font-black text-white">${availableBalance.toFixed(2)}</h3>
               </div>
            </div>

            <div className="space-y-6 text-white">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Extraction Amount (USD)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min $10.00"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-xl font-black focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">USDT Receive Address (BEP20)</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste your 0x... address"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-600 transition-all font-mono"
                />
              </div>

              <button className="w-full bg-zinc-100 text-black hover:bg-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 text-[11px]">
                <ArrowUpLeft size={18} /> Execute Payout Request
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem]">
            <div className="bg-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-red-500" size={24} />
            </div>
            <h4 className="text-sm font-black uppercase italic mb-3 text-white text-3xl">Protocol Rules</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-tighter">Settlement time: 02 - 24 hours.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-tighter">Network fee: 2.5% per transaction.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}