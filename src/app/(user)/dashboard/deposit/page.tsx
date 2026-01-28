"use client";
import { useState, useEffect } from "react";
import { Wallet, Copy, ShieldCheck, Info, Loader2, CheckCircle2 } from "lucide-react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState({
    adminWalletAddress: "",
    tonWalletAddress: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setConfig({
          adminWalletAddress: data.adminWalletAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          tonWalletAddress: data.tonWalletAddress || "",
        });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!amount || !hash) return alert("Please fill all fields");
    setSubmitting(true);
    try {
      // Mock submit - existing logic likely uses a separate API
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), transactionHash: hash, planName: "Manual Deposit" }),
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple alert or toast could be added here
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
            <input 
              type="number" 
              placeholder="Min $50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-xl font-black text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Transaction Hash / Proof</label>
            <input 
              type="text" 
              placeholder="Paste TRX ID or Hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg shadow-blue-600/10 text-white flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Deposit Request"}
          </button>
        </div>

        {/* Wallet Side */}
        <div className="space-y-6">
          {/* BEP20 Wallet */}
          <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[2.5rem]">
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">Official USDT (BEP20) Address</p>
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono text-zinc-400 break-all">{config.adminWalletAddress}</span>
              <button 
                onClick={() => copyToClipboard(config.adminWalletAddress)} 
                className="bg-blue-600/10 p-2 rounded-lg text-blue-500 hover:bg-blue-600 hover:text-white transition"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* TON Wallet */}
          {config.tonWalletAddress && (
            <div className="bg-blue-400/5 border border-blue-400/20 p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-2 mb-4">
                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Telegram / TON Wallet</p>
                 <span className="bg-blue-400/10 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-blue-400/20">NEW</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-zinc-400 break-all">{config.tonWalletAddress}</span>
                <button 
                  onClick={() => copyToClipboard(config.tonWalletAddress)} 
                  className="bg-blue-400/10 p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:text-white transition"
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
                   Send only the exact asset type mentioned. Using different networks or coins will result in terminal loss of capital.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}