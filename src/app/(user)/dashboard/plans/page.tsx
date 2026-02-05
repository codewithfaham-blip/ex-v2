"use client";
import { Zap, ShieldCheck, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const plans = [
  { name: "Starter Pulse", min: 10, max: 99, roi: "1.5%", duration: "24 Hours", icon: <Zap className="text-blue-500" />, popular: false },
  { name: "Pro Matrix", min: 100, max: 499, roi: "2.5%", duration: "48 Hours", icon: <Trophy className="text-yellow-500" />, popular: true },
  { name: "Elite Nexus", min: 500, max: 1000, roi: "5.0%", duration: "72 Hours", icon: <Crown className="text-purple-500" />, popular: false }
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) < selectedPlan.min || parseFloat(amount) > selectedPlan.max) {
      alert(`Please enter an amount between $${selectedPlan.min} and $${selectedPlan.max}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: parseFloat(amount)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedPlan(null);
          setAmount("");
        }, 3000);
      } else {
        alert(data.error || "Purchase failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
            Active <span className="text-blue-600">Terminals</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Select a Liquidity Pool to Deploy Capital • Platform Health: <span className="text-emerald-500 italic uppercase">Optimal</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-zinc-900/30 border ${plan.popular ? 'border-blue-600/50 shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]' : 'border-zinc-800/50'} p-8 rounded-[2.5rem] flex flex-col`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black px-4 py-1 rounded-full uppercase italic">Top Performer</span>}
            
            <div className="bg-zinc-950 p-4 w-fit rounded-2xl border border-zinc-800 mb-6">{plan.icon}</div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-white">{plan.name}</h3>
            
            <div className="mb-8">
              <span className="text-5xl font-black text-white">{plan.roi}</span>
              <span className="text-[10px] font-black text-zinc-500 uppercase ml-2">Daily Yield</span>
            </div>

            <div className="space-y-4 mb-8 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="text-zinc-500">Min/Max:</span> 
                <span>${plan.min} - ${plan.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cycle:</span> 
                <span>{plan.duration}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlan(plan)}
              className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-white ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20' : 'bg-zinc-800 hover:bg-zinc-700'}`}
            >
              Initiate Node <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-500">
                  {selectedPlan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{selectedPlan.name}</h3>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Investment Confirmation</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Investment Amount ($)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min $${selectedPlan.min}`}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                  <p className="text-[9px] text-zinc-600 mt-2 uppercase font-bold italic">Enter amount between ${selectedPlan.min} and ${selectedPlan.max}</p>
                </div>

                <div className="bg-blue-600/5 border border-blue-600/10 p-4 rounded-2xl">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-zinc-500 mb-1">
                      <span>Daily Profit</span>
                      <span className="text-emerald-500">+{selectedPlan.roi}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-zinc-500">
                      <span>Term Duration</span>
                      <span className="text-white">{selectedPlan.duration}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePurchase}
                  disabled={loading || success}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${success ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'} disabled:opacity-50 text-white`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                  {loading ? "Activating..." : success ? "Node Active" : "Confirm Investment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
