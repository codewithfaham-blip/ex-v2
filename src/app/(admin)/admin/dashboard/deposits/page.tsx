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
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
            Inbound <span className="text-emerald-500">Validation</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5 italic">
          Verify blockchain hashes and update user liquidity • Status: <span className="text-emerald-500 italic">Live Tracking</span>
        </p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
              <th className="p-6">Investor</th>
              <th className="p-6">Asset Amount</th>
              <th className="p-6">Transaction Hash / Slip</th>
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
                    <p className="text-lg font-black text-emerald-500 tracking-tighter">Rs. {dep.amount.toFixed(2)}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 cursor-pointer transition-colors">
                        <Hash size={12} />
                        <span className="text-[10px] font-mono">{dep.transactionId}</span>
                        <ExternalLink size={12} />
                      </div>
                      {(dep as any).slipImage && (
                        <div className="mt-2 group/slip">
                          <p className="text-[7px] font-black uppercase text-zinc-600 mb-1 tracking-widest">Verification Slip</p>
                          <div className="relative w-24 h-16 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer shadow-lg">
                            <img src={(dep as any).slipImage} alt="Payment Slip" className="w-full h-full object-cover grayscale group-hover/slip:grayscale-0 transition-all duration-500" />
                            <div 
                              onClick={() => {
                                const win = window.open("", "_blank");
                                if (win) {
                                  win.document.write(`
                                    <html>
                                      <body style="margin:0; background:#000; display:flex; items-center; justify-content:center; height:100vh;">
                                        <img src="${(dep as any).slipImage}" style="max-width:90%; max-height:90%; border-radius:10px; box-shadow:0 0 50px rgba(0,0,0,0.5);" />
                                      </body>
                                    </html>
                                  `);
                                }
                              }}
                              className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover/slip:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                            >
                              <span className="text-[8px] font-black uppercase text-white tracking-tighter">View Full</span>
                            </div>
                          </div>
                        </div>
                      )}
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
