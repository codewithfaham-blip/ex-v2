"use client";
import { Layers, Edit3, Plus, Power, Trash2, X, Loader2, CheckCircle2, Save, Zap, Trophy, Crown } from "lucide-react";
import { useState, useEffect } from "react";

const icons = ["Zap", "Trophy", "Crown"];

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    minAmount: "",
    maxAmount: "",
    roi: "",
    duration: "24 Hours",
    icon: "Zap",
    popular: false,
    active: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      minAmount: "",
      maxAmount: "",
      roi: "",
      duration: "24 Hours",
      icon: "Zap",
      popular: false,
      active: true,
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      minAmount: plan.minAmount.toString(),
      maxAmount: plan.maxAmount.toString(),
      roi: plan.roi.toString(),
      duration: plan.duration,
      icon: plan.icon || "Zap",
      popular: plan.popular,
      active: plan.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan? This will NOT affect existing deposits but will disappear from future options.")) return;
    
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      if (res.ok) fetchPlans();
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : "/api/admin/plans";
    const method = editingPlan ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          resetForm();
          fetchPlans();
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save plan");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">
            Investment <span className="text-blue-600">Protocols</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            Configure ROI rates and participation limits
          </p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-zinc-900/40 border ${plan.active ? 'border-zinc-800/50' : 'border-red-900/30 grayscale'} p-8 rounded-[2.5rem] relative group overflow-hidden transition-all hover:border-blue-500/30`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Layers size={80} />
            </div>
            
            {!plan.active && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase italic z-10">
                Disabled
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                  {plan.name}
                  {plan.popular && <span className="text-blue-500 ml-2 animate-pulse">*</span>}
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{plan.duration}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(plan)}
                  className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-blue-500 transition active:scale-90"
                >
                  <Edit3 size={16}/>
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-red-500/50 hover:text-red-500 transition active:scale-90"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/50 pt-6">
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Daily ROI</p>
                <p className="text-lg font-black text-blue-500">{plan.roi}%</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Min Entry</p>
                <p className="text-lg font-black text-white">${plan.minAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest">Max Entry</p>
                <p className="text-lg font-black text-white">${plan.maxAmount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                {editingPlan ? "Modify" : "Create"} <span className="text-blue-600">Protocol</span>
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-zinc-500 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Plan Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Min amount ($)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Max amount ($)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Daily ROI (%)</label>
                  <input 
                    required
                    type="number" 
                    step="0.1"
                    value={formData.roi}
                    onChange={(e) => setFormData({...formData, roi: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-blue-500 focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Duration</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 mt-2 text-white focus:outline-none focus:border-blue-600 transition-all font-bold appearance-none"
                  >
                    <option value="24 Hours">24 Hours</option>
                    <option value="48 Hours">48 Hours</option>
                    <option value="72 Hours">72 Hours</option>
                    <option value="7 Days">7 Days</option>
                    <option value="30 Days">30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Icon Style</label>
                  <div className="flex gap-2 mt-2">
                     {icons.map(icon => (
                       <button 
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`p-3 rounded-xl border transition-all ${formData.icon === icon ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                       >
                         {icon === "Zap" && <Zap size={16} />}
                         {icon === "Trophy" && <Trophy size={16} />}
                         {icon === "Crown" && <Crown size={16} />}
                       </button>
                     ))}
                  </div>
                </div>
                <div className="flex items-end gap-2 pb-2">
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, popular: !formData.popular})}
                    className={`flex-1 py-4 rounded-xl border text-[9px] font-black uppercase italic transition-all ${formData.popular ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
                   >
                     Recommended
                   </button>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, active: !formData.active})}
                    className={`flex-1 py-4 rounded-xl border text-[9px] font-black uppercase italic transition-all ${formData.active ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' : 'bg-red-600/20 border-red-500/50 text-red-400'}`}
                   >
                     {formData.active ? 'Protocol Live' : 'Offline'}
                   </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${success ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'} disabled:opacity-50 text-white mt-4`}
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {submitting ? "Processing..." : success ? "Updated Successfully" : editingPlan ? "Commit Changes" : "Deploy Protocol"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}