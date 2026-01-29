"use client";
import { useState, useEffect } from "react";
import { Wallet, Copy, ShieldCheck, Info, Loader2, CheckCircle2, Zap } from "lucide-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useSession } from "next-auth/react";

export default function DepositPage() {
  const { data: session } = useSession();
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tonLoading, setTonLoading] = useState(false);
  const [tonPrice, setTonPrice] = useState(0);
  const [config, setConfig] = useState({
    adminWalletAddress: "",
    tonWalletAddress: "",
  });

  useEffect(() => {
    // Fetch Settings
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setConfig({
          adminWalletAddress: data.adminWalletAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          tonWalletAddress: data.tonWalletAddress || "",
        });
        setLoading(false);
      });

    // Fetch TON Price
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd")
      .then(res => res.json())
      .then(data => {
        setTonPrice(data['the-open-network']?.usd || 0);
      })
      .catch(() => setTonPrice(7.5)); // Fallback price
  }, []);

  const handleManualSubmit = async () => {
    if (!amount || !hash) return alert("Please fill all fields");
    setSubmitting(true);
    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          transactionHash: hash, 
          planName: "Manual Deposit" 
        }),
      });
      if (res.ok) {
        alert("Deposit request submitted for verification!");
        setAmount("");
        setHash("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTonOneTap = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid amount");
    if (!config.tonWalletAddress) return alert("TON Gateway is not configured");
    if (!tonConnectUI.connected) return tonConnectUI.openModal();

    setTonLoading(true);
    try {
      // Calculate nanoTons (Amount / Price * 1e9)
      const tonNeeded = parseFloat(amount) / tonPrice;
      const nanoTons = Math.floor(tonNeeded * 1000000000).toString();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: config.tonWalletAddress,
            amount: nanoTons,
            // You can add a comment/payload here to identify the user
            payload: "" 
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      // Auto-submit to backend after success
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          transactionHash: result.boc, // Use BOC or hash depending on verification logic
          planName: "One-Tap TON Deposit" 
        }),
      });

      if (res.ok) {
        alert("One-Tap Payment Successful! Balance will update shortly.");
        setAmount("");
      }
    } catch (err) {
      console.error("TON Transaction failed", err);
      alert("Payment cancelled or failed");
    } finally {
      setTonLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Inject <span className="text-blue-600">Capital</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Automatic verification via blockchain terminal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Deposit Amount (USD)</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="Min $10.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-xl font-black text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
              />
              {amount && tonPrice > 0 && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 uppercase italic">
                  ≈ {(parseFloat(amount) / tonPrice).toFixed(2)} TON
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* One-Tap TON Button */}
            <button 
              onClick={handleTonOneTap}
              disabled={tonLoading || !amount}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 active:scale-95 ${tonLoading ? 'bg-zinc-800' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 text-white'}`}
            >
              {tonLoading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> One-Tap Pay (TON)</>}
            </button>

            <div className="relative py-2">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
               <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-zinc-950 px-4 text-zinc-600">OR MANUAL SUBMIT</span></div>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Paste Transaction Hash / BOC"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-zinc-700 placeholder:text-zinc-800"
              />
              <button 
                onClick={handleManualSubmit}
                disabled={submitting || !hash}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-50 py-4 rounded-xl font-bold uppercase tracking-widest transition text-[10px] text-zinc-400"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Manual Proof"}
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Side */}
        <div className="space-y-6">
          {/* BEP20 Wallet */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem]">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-1 h-1 bg-zinc-500 rounded-full" /> USDT (BEP20) Address
            </p>
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono text-zinc-400 break-all">{config.adminWalletAddress}</span>
              <button 
                onClick={() => copyToClipboard(config.adminWalletAddress)} 
                className="bg-zinc-900 p-2 rounded-lg text-zinc-500 hover:text-white transition"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* TON Wallet */}
          {config.tonWalletAddress && (
            <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 text-blue-600/10 rotate-12"><Zap size={120} /></div>
               <div className="flex items-center gap-2 mb-4">
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">TON Gateway Address</p>
                  <span className="bg-blue-600/10 text-blue-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-blue-600/20">AUTO</span>
               </div>
               <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4 relative z-10">
                 <span className="text-[10px] font-mono text-blue-500/80 break-all">{config.tonWalletAddress}</span>
                 <button 
                   onClick={() => copyToClipboard(config.tonWalletAddress)} 
                   className="bg-blue-600/10 p-2 rounded-lg text-blue-500 hover:bg-blue-600 hover:text-white transition"
                 >
                   <Copy size={16} />
                 </button>
               </div>
            </div>
          )}

          <div className="bg-zinc-900/20 p-6 rounded-[2rem] border border-zinc-800/50">
             <div className="flex items-start gap-3 text-zinc-500">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[9px] font-bold leading-relaxed uppercase">
                   For "One-Tap" payments, ensure your TON wallet is connected. The system will automatically calculate the TON equivalent based on live market rates.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
