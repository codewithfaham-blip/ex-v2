"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [tid, setTid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const methods = settings ? [
    { id: 'jazzcash', name: 'JazzCash', holder: settings.jazzCashName, account: settings.jazzCashNumber, type: 'local' },
    { id: 'easypaisa', name: 'EasyPaisa', holder: settings.easyPaisaName, account: settings.easyPaisaNumber, type: 'local' },
    { id: 'usdt', name: 'USDT (TRC20)', address: settings.adminWalletAddress, type: 'crypto' }
  ] : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // API call yahan aye gi jo Deposit request create karegi
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), gateway: selectedMethod.name, transactionId: tid }),
      });
      if(res.ok) {
        alert("Request Sent! Wait for Admin Approval.");
        setAmount("");
        setTid("");
        setSelectedMethod(null);
      } else {
        const error = await res.json();
        alert(error.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to submit deposit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-black italic tracking-tighter text-blue-600">INITIALIZE_DEPOSIT</h1>

      {/* 1. Select Method */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!settings ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
          ))
        ) : (
          methods.map((m) => (
            <div 
              key={m.id} 
              onClick={() => setSelectedMethod(m)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedMethod?.id === m.id ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-800 bg-zinc-900/50'}`}
            >
              <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-500">{m.type}</p>
              <h3 className="text-lg font-black italic">{m.name}</h3>
            </div>
          ))
        )}
      </div>

      {/* 2. Payment Details */}
      {selectedMethod && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center p-4 bg-black rounded-2xl border border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Account / Address</p>
              <p className="font-mono text-blue-400">{selectedMethod.account || selectedMethod.address}</p>
              {selectedMethod.holder && <p className="text-xs text-zinc-400">Name: {selectedMethod.holder}</p>}
            </div>
            <button onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)} className="p-2 bg-zinc-800 rounded-lg hover:text-blue-500">
              <Copy size={18} />
            </button>
          </div>

          {/* 3. Deposit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="number" placeholder="Enter Amount ($)" 
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-600 text-white"
              onChange={(e) => setAmount(e.target.value)} 
              value={amount}
              required
            />
            <input 
              type="text" placeholder="Transaction ID (TID)" 
              className="w-full bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-600 text-white"
              onChange={(e) => setTid(e.target.value)} 
              value={tid}
              required
            />
            <button 
              disabled={loading}
              className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 text-white hover:bg-blue-700 transition"
            >
              {loading ? "Transmitting..." : <><Zap size={18} /> Confirm Deposit Slip</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
