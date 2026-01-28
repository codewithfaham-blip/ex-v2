import { ShieldAlert, Wallet, Save, Lock } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1000px] mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Core <span className="text-blue-600 text-5xl">Parameters</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Global system security and wallet configuration</p>
      </div>

      <div className="space-y-8">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem]">
          <div className="flex items-center gap-4 mb-8">
            <Wallet className="text-blue-600" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest italic">Master Deposit Wallet (BEP20)</h2>
          </div>
          <input 
            type="text" 
            defaultValue="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-mono text-zinc-400 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
          />
          <p className="text-[9px] text-zinc-600 mt-4 uppercase font-bold italic tracking-tighter text-blue-500/80">This address will be shown to all investors during the deposit process.</p>
        </div>

        <div className="bg-red-600/5 border border-red-600/10 p-8 rounded-[3rem]">
          <div className="flex items-center gap-4 mb-8">
            <ShieldAlert className="text-red-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest italic text-red-500">System lockdown</h2>
          </div>
          <div className="flex items-center justify-between bg-zinc-950 p-6 rounded-2xl border border-zinc-900 group hover:border-red-500/50 transition-all">
             <div>
                <p className="text-xs font-black uppercase text-white">Maintenance Mode</p>
                <p className="text-[9px] text-zinc-600 uppercase font-bold mt-1 tracking-widest">Disable all user transactions instantly</p>
             </div>
             <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer border border-zinc-700">
                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full transition-all" />
             </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]">
          <Save size={18} /> Deploy Changes
        </button>
      </div>
    </div>
  );
}
