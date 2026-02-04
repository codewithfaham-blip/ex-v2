import { db } from "@/lib/db";
import { Users, Wallet, ArrowUpRight, Clock, Activity, ShieldAlert, BarChart3, Zap, Globe } from "lucide-react";
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
  const [users, totalUsers, completedStats, pendingDeposits, totalWithdrawals] = await Promise.all([
    db.user.findMany({
      include: { deposits: true, withdrawals: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    db.user.count(),
    // DEPOSIT: Yahan "APPROVED" enum expected hai
    db.deposit.aggregate({ 
      _sum: { amount: true }, 
      where: { status: "APPROVED" } 
    }),
    db.deposit.count({ 
      where: { status: "PENDING" } 
    }),
    // WITHDRAWAL: Yahan "COMPLETED" enum expected hai
    db.withdrawal.aggregate({ 
      _sum: { amount: true }, 
      where: { status: "COMPLETED" } 
    })
  ]);

  const totalVolume = (completedStats._sum.amount || 0) + (totalWithdrawals._sum.amount || 0);

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto bg-black min-h-screen text-white">
      {/* TOP COMMAND BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
               <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                 Intelligence <span className="text-blue-600">Terminal</span>
               </h1>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
              Secure Administrative Node • Global Traffic: <span className="text-emerald-500 italic">Optimized</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-4 hover:border-zinc-700 transition-all cursor-default group">
               <Globe size={20} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
               <div className="text-left">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Server Location</p>
                  <p className="text-[10px] font-black uppercase text-zinc-300">Global / Encrypted</p>
               </div>
            </div>
            <div className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95 group">
               <Zap size={18} className="text-white group-hover:animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest">Execute System Audit</span>
            </div>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Liquidity Card */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group transition-all hover:bg-zinc-900/40">
            <BarChart3 className="absolute -right-4 -bottom-4 text-blue-600/5 w-32 h-32 rotate-12" />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Total Liquidity
            </p>
            <h3 className="text-4xl font-black text-white tracking-tighter">${(completedStats._sum.amount || 0).toLocaleString()}</h3>
            <p className="text-emerald-500 text-[9px] font-black uppercase mt-4 flex items-center gap-1 italic">
               <ArrowUpRight size={12}/> +12.5% vs Last Month
            </p>
          </div>

          {/* Pending Sync Card */}
          <div className={`border p-8 rounded-[2.5rem] transition-all relative overflow-hidden ${pendingDeposits > 0 ? 'bg-amber-600/5 border-amber-600/30' : 'bg-zinc-900/20 border-zinc-800/50'}`}>
            <Clock className={`absolute -right-4 -bottom-4 w-32 h-32 rotate-12 opacity-5 ${pendingDeposits > 0 ? 'text-amber-600' : 'text-zinc-500'}`} />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Pending Requests</p>
            <h3 className={`text-4xl font-black tracking-tighter ${pendingDeposits > 0 ? 'text-amber-500 animate-pulse' : 'text-white'}`}>
              {pendingDeposits}
            </h3>
            <p className="text-zinc-600 text-[9px] font-black uppercase mt-4 italic">Awaiting Admin Validation</p>
          </div>

          {/* User Metrics Card */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group transition-all hover:bg-zinc-900/40">
            <Users className="absolute -right-4 -bottom-4 text-blue-600/5 w-32 h-32 rotate-12" />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Network Nodes</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">{totalUsers}</h3>
            <p className="text-blue-500 text-[9px] font-black uppercase mt-4 flex items-center gap-1 italic">
               <Activity size={12}/> {Math.floor(totalUsers * 0.8)} Active Sessions
            </p>
          </div>

          {/* Volume Card */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group transition-all hover:bg-zinc-900/40">
            <Wallet className="absolute -right-4 -bottom-4 text-emerald-600/5 w-32 h-32 rotate-12" />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Platform Volume</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">${totalVolume.toLocaleString()}</h3>
            <p className="text-zinc-600 text-[9px] font-black uppercase mt-4 italic">Total Capital Movement</p>
          </div>
        </div>

        {/* MAIN DATABASE VIEW */}
        <div className="bg-zinc-900/10 border border-zinc-800/50 rounded-[3rem] p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                  <ShieldAlert className="text-blue-500" size={24} />
               </div>
               <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                 Investor <span className="text-blue-600">Intelligence</span>
               </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800/50 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] italic">
                  <th className="pb-6 px-4">Entity Identity</th>
                  <th className="pb-6 px-4">Asset Portfolio</th>
                  <th className="pb-6 px-4">Node Health</th>
                  <th className="pb-6 px-4 text-right">Access Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {users.filter(u => u.role !== 'ADMIN').map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-900/40 transition-all group">
                    <td className="py-8 px-4 font-black">
                      {user.email}
                    </td>
                    <td className="py-8 px-4">
                      <p className="text-xl font-black text-white tracking-widest">${user.balance.toFixed(2)}</p>
                    </td>
                    <td className="py-8 px-4">
                       <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${Math.min(user.deposits.length * 10, 100)}%` }} />
                       </div>
                    </td>
                    <td className="py-8 px-4 text-right">
                      <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-6 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all italic">
                        Manage Node
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