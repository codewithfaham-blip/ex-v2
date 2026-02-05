"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpLeft, ShieldCheck, Coins, Loader2, Wallet, CheckCircle2 } from "lucide-react";
import { useTonAddress } from "@tonconnect/ui-react";

export default function WithdrawPage() {
  const tonAddress = useTonAddress();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile"); // I'll create this API
      const data = await res.json();
      setUserData(data);
      if (data.walletAddress && !address) {
        setAddress(data.walletAddress);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !address) return alert("Please enter amount and address");
    if (parseFloat(amount) > (userData?.balance || 0)) return alert("Insufficient balance");
    
    setExecuting(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), address }),
      });
      if (res.ok) {
        alert("Extraction request logged in terminal. Processing...");
        setAmount("");
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  const fillConnectedWallet = () => {
    if (tonAddress) {
      setAddress(tonAddress);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-6xl mx-auto">
      <div className="mb-10 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-white">
            Funds <span className="text-blue-600">Extraction</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Request Profit Settlement • Terminal: <span className="text-red-500 italic uppercase">Active</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/5 rounded-full blur-[80px]" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/10">
                     <Coins className="text-emerald-500" size={24} />
                  </div>
                  <div>
                     <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Available Liquidity</p>
                     <h3 className="text-4xl font-black text-white tracking-tighter">${userData?.balance?.toFixed(2) || "0.00"}</h3>
                  </div>
               </div>
               
               {tonAddress && (
                 <button 
                  onClick={fillConnectedWallet}
                  className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group"
                 >
                    <Wallet size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-400">Use TON Wallet</span>
                 </button>
               )}
            </div>

            <div className="space-y-6 text-white relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase text-zinc-500">Extraction Amount (USD)</label>
                   <button onClick={() => setAmount(userData?.balance.toString())} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Max Available</button>
                </div>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min $10.00"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-xl font-black focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-900 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Receiving Destination Hash (BEP20 / TON)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste 0x... or TON address"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-600 transition-all font-mono text-zinc-300"
                  />
                  {address === tonAddress && tonAddress && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-500">
                       <CheckCircle2 size={16} />
                       <span className="text-[8px] font-black uppercase">Telegram Link</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={executing}
                className="w-full bg-zinc-100 text-black hover:bg-white disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 text-[11px] mt-4"
              >
                {executing ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpLeft size={18} />}
                {executing ? "Processing..." : "Execute Payout Request"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem]">
            <div className="bg-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-red-500" size={24} />
            </div>
            <h4 className="text-sm font-black uppercase italic mb-6 text-white text-3xl">Protocol Rules</h4>
            <ul className="space-y-5">
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wider italic">Settlement window: 02 - 24 hours.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wider italic">Extraction fee: 2.5% system tax.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wider italic">Ensure destination hash compatibility.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}