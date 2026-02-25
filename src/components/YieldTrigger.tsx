"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function YieldTrigger() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCalculate = async () => {
    if (!confirm("Initiate global yield distribution? This will calculate and credit daily profits to all active nodes currently in the system.")) return;
    
    setLoading(true);
    const promise = fetch("/api/admin/yields/calculate", {
      method: "POST",
    });

    toast.promise(promise, {
      loading: 'Executing neural yield distribution...',
      success: async (res: Response) => {
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Distribution failed");
        }
        router.refresh();
        return 'Global yields successfully synchronized across all active nodes';
      },
      error: (err: any) => err.message || 'Processing execution failed',
    });

    try {
      await promise;
    } catch (error) {
       console.error("❌ Yield distribution error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={handleCalculate}
      className={`bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/20 active:scale-95 group ${loading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {loading ? (
        <Loader2 size={14} className="text-white animate-spin" />
      ) : (
        <Zap size={14} className="text-white group-hover:animate-pulse" />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest text-white">
        {loading ? "Processing Yields..." : "Re-calculate Yields"}
      </span>
    </div>
  );
}
