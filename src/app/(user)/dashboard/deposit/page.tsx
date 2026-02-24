"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [tid, setTid] = useState("");
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const methods = settings ? [
    { 
      id: 'jazzcash', 
      name: 'JazzCash', 
      holder: settings.jazzCashName, 
      account: settings.jazzCashNumber, 
      type: 'local',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
        </div>
      )
    },
    { 
      id: 'easypaisa', 
      name: 'EasyPaisa', 
      holder: settings.easyPaisaName, 
      account: settings.easyPaisaNumber, 
      type: 'local',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
        </div>
      )
    },
    { 
      id: 'usdt', 
      name: 'USDT (TRC20)', 
      address: settings.adminWalletAddress, 
      type: 'crypto',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
        </div>
      )
    }
  ] : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress and set state
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setSlipImage(compressedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) {
      alert("Please upload a payment slip image as proof of your deposit.");
      setLoading(false);
      return;
    }

    // API call yahan aye gi jo Deposit request create karegi
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          gateway: selectedMethod.name, 
          transactionId: tid,
          slipImage: slipImage 
        }),
      });
      if(res.ok) {
        alert("Request Sent! Wait for Admin Approval.");
        setAmount("");
        setTid("");
        setSlipImage("");
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
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-4xl mx-auto space-y-8 text-white">
      <div className="lg:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
            Initialize <span className="text-blue-600">Deposit</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
          Secure Capital Injection Terminal • Gateway: <span className="text-blue-500 italic">Verified</span>
        </p>
      </div>

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
              className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${selectedMethod?.id === m.id ? 'border-blue-600 bg-blue-600/10 scale-105 shadow-xl shadow-blue-600/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
            >
              {m.logo}
              <div>
                <p className="font-bold uppercase text-[8px] tracking-[0.3em] text-zinc-500 mb-1">{m.type}</p>
                <h3 className="text-sm font-black italic tracking-tighter">{m.name}</h3>
              </div>
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
              type="number" placeholder="Enter Amount (Rs.)" 
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
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Upload Cash Slip / Payment Proof</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="slip-upload"
                  required
                />
                <label 
                  htmlFor="slip-upload"
                  className="w-full bg-black border-2 border-dashed border-zinc-800 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-600/50 transition-all group"
                >
                  {slipImage ? (
                    <div className="w-full h-40 relative">
                      <img src={slipImage} alt="Slip Preview" className="w-full h-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-widest">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-blue-500 transition-colors">
                        <Zap size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Tap to browse or drop slip</p>
                    </>
                  )}
                </label>
              </div>
            </div>
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
