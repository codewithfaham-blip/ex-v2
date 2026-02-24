import { db } from "@/lib/db";
import { Users, Wallet, ArrowUpRight, Clock, Activity, ShieldAlert, BarChart3, Zap, Globe, Cpu, Server, History, ArrowDownLeft, TrendingUp } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Security Check
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Real-time Data Fetching
  const [users, totalUsers, completedStats, pendingDeposits, totalWithdrawals, recentTransactions] = await Promise.all([
    db.user.findMany({
      include: { deposits: true, withdrawals: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    db.user.count(),
    db.deposit.aggregate({ 
      _sum: { amount: true }, 
      where: { status: "APPROVED" } 
    }),
    db.deposit.count({ 
      where: { status: "PENDING" } 
    }),
    db.withdrawal.aggregate({ 
      _sum: { amount: true }, 
      where: { status: "COMPLETED" } 
    }),
    db.deposit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { email: true } } }
    })
  ]);

  const totalVolume = (completedStats._sum.amount || 0) + (totalWithdrawals._sum.amount || 0);

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-[1600px] mx-auto bg-black min-h-screen text-white space-y-8">
      
      {/* 1. TOP COMMAND BAR - Hidden on Desktop */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 lg:hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
              Intelligence <span className="text-blue-600">Terminal</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em] ml-5">
            Admin Crypt-Node v2.0.4 • Status: <span className="text-emerald-500 italic">Synchronized</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-zinc-900/40 border border-zinc-800/50 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <Server size={14} className="text-zinc-500" />
            <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Latency: <span className="text-emerald-500">24ms</span></div>
          </div>
          <div className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95 group">
            <Zap size={14} className="text-white group-hover:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Re-calculate Yields</span>
          </div>
        </div>
      </div>

      {/* 2. CORE ANALYTICS (Compact Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Liquidity", val: `$${(completedStats._sum.amount || 0).toLocaleString()}`, icon: <BarChart3 className="text-blue-500" />, trend: "+12.5%", color: "blue" },
          { label: "Pending Synths", val: pendingDeposits, icon: <Clock className={pendingDeposits > 0 ? "text-amber-500" : "text-zinc-500"} />, trend: "Awaiting", color: pendingDeposits > 0 ? "amber" : "zinc" },
          { label: "Active Nodes", val: totalUsers, icon: <Users className="text-purple-500" />, trend: "Live", color: "purple" },
          { label: "Platform Volume", val: `$${totalVolume.toLocaleString()}`, icon: <Wallet className="text-emerald-500" />, trend: "Global", color: "emerald" },
        ].map((card, i) => (
          <div key={i} className={`bg-zinc-900/30 border border-zinc-800/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group`}>
             <div className="flex justify-between items-start mb-2 md:mb-4">
                <div className="bg-zinc-950 p-2 md:p-2.5 rounded-lg md:rounded-xl border border-zinc-800 scale-75 md:scale-100 origin-top-left">{card.icon}</div>
                <span className={`text-[6px] md:text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-${card.color}-500/10 text-${card.color}-500 border border-${card.color}-500/20`}>{card.trend}</span>
             </div>
             <p className="text-zinc-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest mb-0.5 md:mb-1">{card.label}</p>
             <h3 className="text-base md:text-2xl font-black text-white tracking-tighter italic">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. ENHANCED VISUALS: DATA STREAM & ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Live Data Stream (Visual) */}
        <div className="xl:col-span-2 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[450px]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-600/20">
                    <Cpu size={18} className="text-blue-500 animate-pulse" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Infrastructure Neural Grid</h2>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[8px] font-black uppercase text-blue-500">Processing Loop</span>
                   </div>
                   <div className="w-px h-3 bg-zinc-800" />
                   <span className="text-[8px] font-black uppercase text-zinc-500">Uptime: 99.99%</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-12 grid-rows-8 gap-1.5 overflow-hidden">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} className={`h-full rounded-[2px] transition-all duration-[2000ms] ${
                    Math.random() > 0.95 ? 'bg-blue-600 shadow-[0_0_15px_#3b82f6] scale-110' : 
                    Math.random() > 0.8 ? 'bg-zinc-700/50' : 'bg-zinc-900'
                  }`} />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><TrendingUp size={30} className="text-blue-500" /></div>
                    <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Inflow Velocity</p>
                    <div className="flex items-center justify-between relative z-10">
                       <span className="text-xs font-bold text-white uppercase italic">7.2k req/s</span>
                       <TrendingUpBar percentage={75} color="blue" />
                    </div>
                 </div>
                 <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><Zap size={30} className="text-emerald-500" /></div>
                    <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Node Stability</p>
                    <div className="flex items-center justify-between relative z-10">
                       <span className="text-xs font-bold text-white uppercase italic">99% Secure</span>
                       <TrendingUpBar percentage={92} color="emerald" />
                    </div>
                 </div>
                 <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><ShieldAlert size={30} className="text-amber-500" /></div>
                    <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Packet Loss</p>
                    <div className="flex items-center justify-between relative z-10">
                       <span className="text-xs font-bold text-white uppercase italic">0.02% Trace</span>
                       <TrendingUpBar percentage={5} color="amber" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-6 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <History size={16} className="text-emerald-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Live Transaction Feed</h2>
           </div>

           <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {recentTransactions.map((tx: any) => (
                <div key={tx.id} className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                         <ArrowDownLeft size={14} />
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-zinc-300 truncate w-32">{tx.user.email}</p>
                         <p className="text-[7px] font-black text-zinc-600 uppercase tracking-tighter italic">{tx.gateway || 'Network Transfer'}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-white tracking-widest">${tx.amount.toFixed(2)}</p>
                      <p className={`text-[7px] font-black uppercase ${tx.status === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</p>
                   </div>
                </div>
              ))}
           </div>

           <button className="mt-6 w-full py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
              Initialize Data Export
           </button>
        </div>
      </div>

      {/* 4. MAIN USER INTELLIGENCE TABLE (Enhanced) */}
      <div className="bg-zinc-900/10 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-600/20">
                 <ShieldAlert className="text-blue-500" size={18} />
              </div>
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Investor <span className="text-blue-600">Database</span></h2>
           </div>
           <div className="hidden md:flex gap-2">
              <input type="text" placeholder="Search Node ID..." className="bg-zinc-950 border border-zinc-900 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-600 transition-all text-white" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800/50 text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em] italic">
                <th className="pb-4 px-4">Entity Identity</th>
                <th className="pb-4 px-4">Core Balance</th>
                <th className="pb-4 px-4">Portfolio Intensity</th>
                <th className="pb-4 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {users.filter(u => u.role !== 'ADMIN').map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/40 transition-all group">
                  <td className="py-6 px-4">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:animate-ping" />
                          <span className="text-[10px] font-bold text-zinc-300">{user.email}</span>
                       </div>
                       <span className="text-[7px] text-zinc-600 uppercase font-black italic ml-3.5">UID: {user.id.slice(0,8)}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-sm font-black text-white tracking-widest leading-none">${user.balance.toFixed(2)}</span>
                  </td>
                  <td className="py-6 px-4">
                     <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[100px] h-1 bg-zinc-950 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 shadow-[0_0_8px_#3b82f6] transition-all duration-1000" style={{ width: `${Math.min(user.deposits.length * 15, 100)}%` }} />
                        </div>
                        <span className="text-[8px] font-black text-zinc-500">{user.deposits.length} Nodes</span>
                     </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="bg-zinc-950 border border-zinc-900 text-zinc-500 px-4 py-2 rounded-lg text-[8px] font-black uppercase hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all italic active:scale-95 group/btn">
                      <span className="group-hover/btn:translate-x-1 transition-transform inline-block">Investigate Terminal</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrendingUpBar({ percentage, color }: { percentage: number, color: string }) {
   const colors: any = {
      blue: "bg-blue-500 shadow-[0_0_10px_#3b82f6]",
      emerald: "bg-emerald-500 shadow-[0_0_10px_#10b981]",
      amber: "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
   };
   return (
      <div className="w-16 h-1 bg-zinc-900 rounded-full overflow-hidden">
         <div className={`h-full ${colors[color]}`} style={{ width: `${percentage}%` }} />
      </div>
   );
}
