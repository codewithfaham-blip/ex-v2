"use client";
import { Users2, Gift, Copy, Share2, TrendingUp } from "lucide-react";

export default function AffiliatesPage() {
  const referralLink = "https://ex-v2.vercel.app/register?ref=user786"; // Dynamic later

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-7xl mx-auto">
      <div className="mb-10 text-white lg:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
            Network <span className="text-blue-600">Terminal</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Earn 10% Instant Commission • Expansion: <span className="text-blue-500 italic uppercase">Global</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Referral Link Card */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Unique Invitation Link</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl font-mono text-xs text-blue-500 truncate italic">
              {referralLink}
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10"
            >
              <Copy size={16} /> Copy Link
            </button>
          </div>
        </div>

        {/* Total Earned Card */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Network Earnings</p>
          <h3 className="text-4xl font-black text-white italic">Rs. 0.00</h3>
          <div className="mt-6">
            <span className="bg-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Level 1 Active</span>
          </div>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-zinc-800">
          <h3 className="font-black uppercase tracking-tighter italic">Recent <span className="text-blue-500">Referrals</span></h3>
        </div>
        <div className="text-center py-20">
          <Users2 size={40} className="mx-auto text-zinc-800 mb-4" />
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">No partners found in your network yet</p>
        </div>
      </div>
    </div>
  );
}