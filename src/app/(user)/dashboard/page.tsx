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
      
      {/* 1. Header Section */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
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
        <div className="lg:w-[400px]">
           <TelegramWalletContainer />
        </div>
      </div>

      {/* 2. Financial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Balance Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4 italic">Liquidity Balance</p>
          <h3 className="text-6xl font-black text-white tracking-tighter">${user.balance.toFixed(2)}</h3>
          <div className="mt-8 flex items-center gap-2">
             <Activity size={14} className="text-emerald-500" />
             <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Live Portfolio Flowing</span>
          </div>
        </div>

        {/* Deposits Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[3rem] flex flex-col justify-between group hover:border-blue-600/30 transition-all min-h-[220px]">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Injected Assets</p>
            <ArrowDownCircle className="text-blue-500 group-hover:rotate-12 transition-transform" size={24} />
          </div>
          <h3 className="text-4xl font-black text-white">${totalDeposits.toFixed(2)}</h3>
        </div>

        {/* Withdrawals Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[3rem] flex flex-col justify-between group hover:border-emerald-600/30 transition-all min-h-[220px]">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Total Extractions</p>
            <ArrowUpCircle className="text-emerald-500 group-hover:-rotate-12 transition-transform" size={24} />
          </div>
          <h3 className="text-4xl font-black text-emerald-500">${totalWithdrawals.toFixed(2)}</h3>
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
                  <div key={dep.id} className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-[1.5rem] hover:border-zinc-700 transition-all group">
                    <div className="flex items-center gap-5">
                       {dep.gateway === 'JazzCash' && (
                         <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {dep.gateway === 'EasyPaisa' && (
                         <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {dep.gateway?.includes('USDT') && (
                         <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shrink-0">
                           <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
                         </div>
                       )}
                       {!['JazzCash', 'EasyPaisa'].includes(dep.gateway || '') && !dep.gateway?.includes('USDT') && (
                         <div className="bg-blue-600/10 p-3 rounded-xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                          <Wallet size={20} />
                         </div>
                       )}
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-white">{dep.gateway || 'Manual Deposit'}</p>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">TID: {dep.transactionId}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white">+${dep.amount.toFixed(2)}</p>
                      <div className="flex flex-col items-end">
                        <p className={`text-[8px] font-black uppercase tracking-tighter mb-1 ${
                          dep.status === 'APPROVED' ? 'text-emerald-500' : 
                          dep.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'
                        }`}>{dep.status}</p>
                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter">{new Date(dep.createdAt).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Affiliate Terminal Card */}
        <div className="bg-blue-600 p-10 rounded-[3rem] flex flex-col justify-between shadow-2xl shadow-blue-600/30 relative overflow-hidden min-h-[400px]">
           <TrendingUp className="absolute -right-10 -top-10 text-white/10 w-64 h-64 -rotate-12" />
           <div className="relative z-10">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-white leading-tight">Passive<br/>Income<br/>Terminal</h3>
              <p className="text-blue-100 text-xs leading-relaxed font-bold uppercase tracking-wide opacity-80">
                Scale your earnings by 10% on every asset deposit verified through your network link.
              </p>
           </div>
           <button className="bg-white text-blue-600 w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-100 transition shadow-xl relative z-10 active:scale-95">
             Generate Access Link
           </button>
        </div>

      </div>
    </div>
  );
}