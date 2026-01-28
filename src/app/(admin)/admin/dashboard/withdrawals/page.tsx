import { db } from "@/lib/db";
import { ArrowUpRight, Clock, ShieldCheck } from "lucide-react";

export default async function AdminWithdrawals() {
  const withdrawals = await db.withdrawal.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">Payout <span className="text-red-500 text-5xl">Queue</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Process outgoing liquidity requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {withdrawals.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-20 rounded-[2.5rem] text-center text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">
            No Withdrawal Requests Found
          </div>
        ) : (
          withdrawals.map((wd) => (
            <div key={wd.id} className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-red-500/20 transition-all">
              <div className="flex items-center gap-5">
                <div className="bg-red-500/10 p-4 rounded-2xl text-red-500"><ArrowUpRight size={24}/></div>
                <div>
                  <h3 className="font-black text-white uppercase text-sm tracking-tight">{wd.user.email}</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase italic mt-1 tracking-widest truncate max-w-[200px]">Address: {wd.address}</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Extraction Amount</p>
                <p className="text-2xl font-black text-white tracking-tighter">${wd.amount.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-zinc-600 font-black uppercase">Status</p>
                    <span className={`text-[10px] font-black uppercase italic ${wd.status === 'PENDING' ? 'text-amber-500' : 'text-emerald-500'}`}>{wd.status}</span>
                 </div>
                 <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95">Mark as Paid</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
