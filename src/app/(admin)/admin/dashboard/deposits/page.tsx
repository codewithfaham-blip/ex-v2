import { db } from "@/lib/db";
import { Check, X, ExternalLink, Hash } from "lucide-react";
import ClientDepositActions from "@/components/ClientDepositActions";

export default async function AdminDeposits() {
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Inbound <span className="text-emerald-500">Validation</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Verify blockchain hashes and update user liquidity</p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
              <th className="p-6">Investor</th>
              <th className="p-6">Asset Amount</th>
              <th className="p-6">Transaction Hash</th>
              <th className="p-6 text-right">Action Terminal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {pendingDeposits.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">No Pending Injections</td></tr>
            ) : (
              pendingDeposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-zinc-800/20 transition-all group">
                  <td className="p-6">
                    <p className="font-bold text-white uppercase text-xs">{dep.user.email}</p>
                    <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase italic tracking-tighter">Gateway: {dep.gateway}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-lg font-black text-emerald-500 tracking-tighter">${dep.amount.toFixed(2)}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 cursor-pointer transition-colors">
                      <Hash size={12} />
                      <span className="text-[10px] font-mono">{dep.transactionId}</span>
                      <ExternalLink size={12} />
                    </div>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <ClientDepositActions depositId={dep.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
