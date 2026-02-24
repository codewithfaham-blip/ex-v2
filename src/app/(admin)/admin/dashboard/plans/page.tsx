"use client";
import { Layers, Edit3, Plus, Power } from "lucide-react";

export default function AdminPlans() {
  const dummyPlans = [
    { name: "Basic Starter", daily: "1.5%", min: 10, max: 99, status: "ACTIVE" },
    { name: "Basic", daily: "2.5%", min: 100, max: 499, status: "ACTIVE" },
    { name: "Standard", daily: "5.0%", min: 500, max: 1000, status: "ACTIVE" },
  ];

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Investment <span className="text-blue-600">Protocols</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Configure ROI rates and participation limits</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-blue-600/20 transition-all">
          <Plus size={18} /> New Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyPlans.map((plan, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem] relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Layers size={80} />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{plan.name}</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-blue-500 transition"><Edit3 size={16}/></button>
                <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition"><Power size={16}/></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/50 pt-6">
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Daily ROI</p>
                <p className="text-lg font-black text-blue-500">{plan.daily}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Min Entry</p>
                <p className="text-lg font-black text-white">${plan.min}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Max Entry</p>
                <p className="text-lg font-black text-white">${plan.max}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}