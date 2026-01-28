import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users } from "lucide-react";

// --- Helper Components (Fixed Order) ---

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
      <div className="mb-2">{icon}</div>
      <p className="text-xl md:text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-tighter">{label}</p>
    </div>
  );
}

function PlanCard({ title, percent, days, min, max, featured = false }: any) {
  return (
    <div className={`w-full p-6 md:p-8 rounded-[2rem] border ${featured ? 'border-blue-600 bg-blue-600/5 shadow-2xl shadow-blue-900/20' : 'border-zinc-800 bg-zinc-900/30'} relative transition-all hover:scale-[1.02]`}>
      {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Popular</span>}
      <h4 className="text-lg md:text-xl font-bold mb-1">{title} Plan</h4>
      <div className="text-3xl md:text-4xl font-black text-white mb-1">{percent} <span className="text-xs md:text-sm font-medium text-zinc-500 italic">Daily</span></div>
      <p className="text-xs text-zinc-400 mb-6 underline decoration-blue-500/50">Period: {days} Days</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs md:text-sm text-zinc-400">
          <span>Min:</span> <span className="font-bold text-white">${min}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-zinc-400">
          <span>Max:</span> <span className="font-bold text-white">${max}</span>
        </div>
      </div>
      
      <Link href="/register" className={`block w-full text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition ${featured ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
        Invest Now
      </Link>
    </div>
  );
}

// --- Main Page ---

export default function HomePage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen selection:bg-blue-600/30">
      {/* Hero: Fixed for 320px */}
      <header className="pt-12 pb-16 px-4 md:pt-24 md:pb-32 text-center max-w-5xl mx-auto">
        <div className="inline-block bg-blue-600/10 border border-blue-600/20 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-bold mb-6 tracking-widest">
          ESTABLISHED 2026
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tighter">
          Earning <br className="md:hidden" />
          <span className="text-blue-600">Made Easy.</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-xl mb-10 max-w-xl mx-auto leading-relaxed px-2">
          Start your crypto journey with the world&apos;s most reliable high-yield platform. Secure, Fast, and Transparent.
        </p>
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:justify-center">
          <Link href="/register" className="bg-blue-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-blue-700 transition flex items-center justify-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-zinc-800 transition">
            Member Login
          </Link>
        </div>
      </header>

      {/* Stats: Mobile Grid fix */}
      <section className="px-4 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatItem icon={<Users className="text-blue-500" size={20} />} label="Investors" value="12k+" />
          <StatItem icon={<Coins className="text-blue-500" size={20} />} label="Deposits" value="$2.8M" />
          <StatItem icon={<Zap className="text-blue-500" size={20} />} label="Paid Out" value="$1.1M" />
          <StatItem icon={<BarChart3 className="text-blue-500" size={20} />} label="Online" value="456" />
        </div>
      </section>

      {/* Features: New Section for Anchor Link */}
      <section id="features" className="px-4 py-20 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter italic">
            Platform <span className="text-blue-600">Core</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-colors group">
              <ShieldCheck className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="text-xl font-bold mb-4">Elite Security</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Multi-layer encryption and cold storage for all digital assets ensuring maximum capital protection.</p>
            </div>
            <div className="p-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-colors group">
              <Zap className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="text-xl font-bold mb-4">Instant Access</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Global payouts processed in real-time. No delays, no manual approvals for standard withdrawal requests.</p>
            </div>
            <div className="p-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-colors group">
              <BarChart3 className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="text-xl font-bold mb-4">Smart Engine</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Proprietary AI-driven trading engine that optimizes yields across multiple liquidity pools 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="px-4 py-16 max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-5xl font-black text-center mb-12 uppercase tracking-tighter italic">Investment <span className="text-blue-600">Plans</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlanCard title="Starter Pulse" percent="1.5%" days="24 Hours" min="10" max="99" />
          <PlanCard title="Pro Matrix" percent="2.5%" days="48 Hours" min="100" max="499" featured={true} />
          <PlanCard title="Elite Nexus" percent="5.0%" days="72 Hours" min="500" max="1,000" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-[10px] md:text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">
          © 2026 Exotic Cash Digital Assets
        </p>
      </footer>
    </div>
  );
}