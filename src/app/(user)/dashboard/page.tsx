import { db } from "@/lib/db";
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, Copy, Activity } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TelegramWalletContainer from "@/components/TelegramWalletContainer";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      deposits: { orderBy: { createdAt: 'desc' } }, 
      withdrawals: { orderBy: { createdAt: 'desc' } } 
    },
  });

  if (!user) return <div className="text-white p-10 font-bold text-center">Identity Not Found</div>;

  const totalDeposits = user.deposits.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawals = user.withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    // Padding-top (pt-24) mobile ke liye hai, lg:pt-10 desktop ke liye
    <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full">
      
      {/* 1. Header Section - Hidden on LG as we have DashboardHeader */}
      <div className="mb-8 lg:hidden flex flex-col justify-between items-stretch gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
              System <span className="text-blue-500">Access:</span> {user.email?.split('@')[0]}
            </h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Node Status: Operational ✓
          </p>
        </div>
        
        {/* Telegram Wallet Container integrated into header area */}
        <div className="w-full">
           <TelegramWalletContainer />
        </div>
      </div>

      {/* 2. Financial Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-10">
        
        {/* Balance Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl col-span-2 md:col-span-1">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          <p className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-2 md:mb-3 italic">Liquidity Balance</p>
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter">${user.balance.toFixed(2)}</h3>
          <div className="mt-4 md:mt-6 flex items-center gap-2">
             <Activity size={10} className="text-emerald-500" />
             <span className="text-emerald-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest">Live Portfolio</span>
          </div>
        </div>

        {/* Deposits Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between group hover:border-blue-600/30 transition-all min-h-[120px] md:min-h-[160px]">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest italic">Injected</p>
            <ArrowDownCircle className="text-blue-500 group-hover:rotate-12 transition-transform" size={16} />
          </div>
          <h3 className="text-lg md:text-2xl font-black text-white">${totalDeposits.toFixed(2)}</h3>
        </div>

        {/* Withdrawals Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-600/30 transition-all min-h-[120px] md:min-h-[160px]">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest italic">Extractions</p>
            <ArrowUpCircle className="text-emerald-500 group-hover:-rotate-12 transition-transform" size={16} />
          </div>
          <h3 className="text-lg md:text-2xl font-black text-emerald-500">${totalWithdrawals.toFixed(2)}</h3>
        </div>

        {/* Live Nodes Card (Mobile Only replacement or 4th card) */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between group hover:border-purple-600/30 transition-all min-h-[120px] md:min-h-[160px] md:hidden">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest italic">Live Nodes</p>
            <Activity className="text-purple-500" size={16} />
          </div>
          <h3 className="text-lg font-black text-white">{user.deposits.filter(d => d.status === 'ACTIVE').length} Active</h3>
        </div>
      </div>

      {/* 3. Bottom Section: Movement & Passive Income */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Movement */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Recent <span className="text-blue-600">Movement</span>
            </h2>
            <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition italic">View All History</button>
          </div>
          
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-6">
            {user.deposits.length === 0 ? (
              <div className="text-center py-24 bg-zinc-950/50 rounded-[2rem] border-2 border-dashed border-zinc-900 flex flex-col items-center">
                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">Empty Terminal Trace</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.deposits.slice(0, 5).map((dep) => (
                  <div key={dep.id} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-900 rounded-[1.2rem] hover:border-zinc-700 transition-all group">
                    <div className="flex items-center gap-4">
                       {dep.gateway === 'JazzCash' && (
                         <div className="w-7 h-7 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {dep.gateway === 'EasyPaisa' && (
                         <div className="w-7 h-7 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {dep.gateway?.includes('USDT') && (
                         <div className="w-7 h-7 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {!['JazzCash', 'EasyPaisa'].includes(dep.gateway || '') && !dep.gateway?.includes('USDT') && (
                         <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                           <Wallet size={16} />
                         </div>
                       )}
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-tight text-white">{dep.gateway || 'Manual Deposit'}</p>
                          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5 italic">TID: {dep.transactionId}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-white">+${dep.amount.toFixed(2)}</p>
                      <div className="flex flex-col items-end">
                        <p className={`text-[7px] font-black uppercase tracking-tighter ${
                          dep.status === 'APPROVED' ? 'text-emerald-500' : 
                          dep.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'
                        }`}>{dep.status}</p>
                        <p className="text-[7px] text-zinc-600 font-black uppercase tracking-tighter">{new Date(dep.createdAt).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Affiliate Terminal Card */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl shadow-blue-600/30 relative overflow-hidden min-h-[320px]">
           <TrendingUp className="absolute -right-10 -top-10 text-white/10 w-48 h-48 -rotate-12" />
           <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-white leading-tight">Passive Income Terminal</h3>
              <p className="text-blue-100 text-[10px] leading-relaxed font-bold uppercase tracking-wide opacity-80">
                Scale your earnings by 10% on every asset deposit verified through your network link.
              </p>
           </div>
           <button className="bg-white text-blue-600 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-100 transition shadow-xl relative z-10 active:scale-95">
             Generate Access Link
           </button>
        </div>

      </div>
    </div>
  );
}