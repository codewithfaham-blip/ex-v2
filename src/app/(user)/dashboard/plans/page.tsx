"use client";
import { Zap, ShieldCheck, Trophy, Crown, ArrowRight } from "lucide-react";

const plans = [
  { name: "Starter Pulse", min: 10, max: 99, roi: "1.5%", duration: "24 Hours", icon: <Zap className="text-blue-500" />, popular: false },
  { name: "Pro Matrix", min: 100, max: 499, roi: "2.5%", duration: "48 Hours", icon: <Trophy className="text-yellow-500" />, popular: true },
  { name: "Elite Nexus", min: 500, max: 1000, roi: "5.0%", duration: "72 Hours", icon: <Crown className="text-purple-500" />, popular: false }
];

export default function PlansPage() {
  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-7xl mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Active <span className="text-blue-600">Terminals</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Select a liquidity pool to deploy capital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-zinc-900/30 border ${plan.popular ? 'border-blue-600/50 shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]' : 'border-zinc-800/50'} p-8 rounded-[2.5rem] flex flex-col`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black px-4 py-1 rounded-full uppercase italic">Top Performer</span>}
            
            <div className="bg-zinc-950 p-4 w-fit rounded-2xl border border-zinc-800 mb-6">{plan.icon}</div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">{plan.name}</h3>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-white">{plan.roi}</span>
              <span className="text-[10px] font-black text-zinc-500 uppercase ml-2">Daily Yield</span>
            </div>

            <div className="space-y-4 mb-8 text-xs font-bold uppercase tracking-wider">
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="text-zinc-500">Min/Max:</span> 
                <span>${plan.min} - ${plan.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cycle:</span> 
                <span>{plan.duration}</span>
              </div>
            </div>

            <button className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
              Initiate Node <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}   