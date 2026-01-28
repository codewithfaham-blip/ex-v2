"use client";
import { useState } from "react";
import { Wallet, Copy, ShieldCheck, Info } from "lucide-react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const adminWallet = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Demo Address

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Inject <span className="text-blue-600">Capital</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Automatic verification via blockchain terminal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Deposit Amount (USD)</label>
            <input 
              type="number" 
              placeholder="Min $50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-xl font-black focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Transaction Hash / Proof</label>
            <input 
              type="text" 
              placeholder="Paste TRX ID or Hash"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg shadow-blue-600/10">
            Submit Deposit Request
          </button>
        </div>

        {/* Wallet Side */}
        <div className="space-y-6">
          <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[2.5rem]">
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">Official USDT (BEP20) Address</p>
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono text-zinc-400 break-all">{adminWallet}</span>
              <button onClick={() => navigator.clipboard.writeText(adminWallet)} className="bg-blue-600/10 p-2 rounded-lg text-blue-500 hover:bg-blue-600 hover:text-white transition">
                <Copy size={16} />
              </button>
            </div>
            <div className="mt-6 flex items-start gap-3 text-zinc-500">
               <Info size={16} className="text-blue-500 shrink-0" />
               <p className="text-[9px] font-bold leading-relaxed uppercase">Send only USDT (BEP20). Sending any other coin will result in permanent loss of funds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}