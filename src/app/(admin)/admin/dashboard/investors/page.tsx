import { db } from "@/lib/db";
import { Search, UserPlus, Filter, MoreHorizontal, ShieldCheck } from "lucide-react";

export default async function InvestorsTerminal() {
  const investors = await db.user.findMany({
    where: { role: "USER" },
    include: { deposits: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Investor <span className="text-blue-600">Assets</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Directory of all verified system nodes</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input placeholder="Search Node ID..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-blue-600 transition-all"/>
          </div>
          <button className="bg-blue-600 p-3 rounded-2xl text-white hover:bg-blue-700 transition"><UserPlus size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {investors.map((investor) => (
          <div key={investor.id} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-zinc-700 transition-all group">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-black italic">
                {investor.email?.[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-blue-500 transition-colors">{investor.email}</h3>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 italic">Joined: {new Date(investor.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto flex-1 px-4 text-center md:text-left">
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter mb-1">Current Liquidity</p>
                <p className="text-lg font-black text-white">Rs. {investor.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter mb-1">Total Injected</p>
                <p className="text-lg font-black text-zinc-400">Rs. {investor.deposits.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter mb-1">Node Security</p>
                <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-emerald-500/20">Active Node</span>
              </div>
            </div>

            <button className="w-full md:w-auto bg-zinc-950 border border-zinc-800 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Edit Balance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}