"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, ShieldCheck, QrCode, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function TwoFactorSetup() {
  const [step, setStep] = useState<"init" | "qr" | "verify" | "done">("init");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qrCodeUrl);
        setSecret(data.secret);
        setStep("qr");
      } else {
        toast.error(data.error || "Failed to start 2FA setup");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) {
         setStep("done");
         toast.success("2FA Enabled Successfully! 🔐");
      } else {
        toast.error(data.error || "Invalid Code");
      }
    } catch (e) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full mx-auto">
       <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600/10 p-3 rounded-xl">
             <ShieldCheck className="text-blue-500" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Two-Factor Auth</h3>
            <p className="text-zinc-500 text-xs">Secure your admin account</p>
          </div>
       </div>

       {step === "init" && (
         <button 
           onClick={startSetup} 
           disabled={loading}
           className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition"
         >
           {loading ? <Loader2 className="animate-spin" /> : <QrCode size={18} />}
           Enable 2FA
         </button>
       )}

       {step === "qr" && (
         <div className="space-y-6 text-center">
            <div className="bg-white p-4 rounded-2xl mx-auto w-fit">
               {qrCode && <Image src={qrCode} alt="2FA QR" width={160} height={160} />}
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
               <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Secret Key</p>
               <code className="text-blue-400 font-mono text-sm">{secret}</code>
            </div>
            <div>
               <label className="block text-left text-zinc-400 text-xs mb-2 ml-1">Enter Authenticator Code</label>
               <input 
                 type="text" 
                 value={code}
                 onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.5em] focus:border-blue-500 outline-none transition"
                 placeholder="000000"
               />
            </div>
            <button 
               onClick={verifyCode}
               disabled={loading || code.length !== 6}
               className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition"
             >
               {loading ? <Loader2 className="animate-spin" /> : "Verify & Enable"}
             </button>
         </div>
       )}

       {step === "done" && (
          <div className="text-center py-8">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
               <CheckCircle2 size={32} className="text-emerald-500" />
             </div>
             <h4 className="text-xl font-black text-white mb-2">2FA Active</h4>
             <p className="text-zinc-400 text-sm">Your account is now secured with Google Authenticator.</p>
          </div>
       )}
    </div>
  );
}
