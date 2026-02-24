"use client";
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Wallet, CheckCircle2, ShieldCheck } from "lucide-react";

export default function TelegramWalletContainer() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync wallet with DB when it changes
  useEffect(() => {
    if (address && mounted) {
      const saveWalletAddress = async (walletAddr: string) => {
        try {
          await fetch("/api/user/update-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: walletAddr }),
          });
        } catch (error) {
          console.error("Failed to sync wallet with database", error);
        }
      };
      saveWalletAddress(address);
    }
  }, [address, mounted]);

  if (!mounted) return null;

  return (
    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group transition-all hover:border-purple-600/30 shadow-sm">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Wallet size={80} className="text-purple-600" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-600/10 p-2.5 rounded-xl border border-purple-600/20">
            <Wallet className="text-purple-600" size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest italic text-slate-900">Telegram Gateway</h3>
        </div>

        {!address ? (
          <div className="space-y-4">
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Connect your Telegram/TON wallet to enable instant asset extractions and node verification.
            </p>
            <div className="pt-2">
              <TonConnectButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Network Connected</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
               <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Active Wallet Hash</p>
               <p className="text-[11px] font-mono text-slate-600 break-all">{address}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold italic">
               <ShieldCheck size={12} />
               <span>Linked to your secure terminal session</span>
            </div>
            <button 
              onClick={() => tonConnectUI.disconnect()}
              className="text-slate-400 hover:text-red-600 transition text-[9px] font-black uppercase tracking-[0.2em] pt-2"
            >
              Detach Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
