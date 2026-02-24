import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users, 
  ChevronRight, Globe, Lock, Cpu, DollarSign, Wallet2, 
  CheckCircle2, HelpCircle, MessageSquare, TrendingUp
} from "lucide-react";
import { db } from "@/lib/db";

// --- Helper Components ---

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
      <p className="text-xs text-zinc-400 mb-6 underline decoration-blue-500/50">Period: {days}</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs md:text-sm text-zinc-400">
          <span>Min:</span> <span className="font-bold text-white">Rs. {min}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-zinc-400">
          <span>Max:</span> <span className="font-bold text-white">Rs. {max}</span>
        </div>
      </div>
      
      <Link href="/register" className={`block w-full text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition ${featured ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
        Invest Now
      </Link>
    </div>
  );
}

function StepCard({ number, title, desc, icon }: any) {
  return (
    <div className="relative p-10 rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 group hover:border-blue-600/30 transition-all">
      <div className="absolute top-6 right-8 text-5xl font-black text-white/5 italic select-none">{number}</div>
      <div className="mb-6 p-4 bg-blue-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-xl font-bold mb-3 text-white">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
      <h4 className="text-base md:text-lg font-bold mb-3 flex items-start gap-3">
        <HelpCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
        {question}
      </h4>
      <p className="text-zinc-500 text-sm md:text-base leading-relaxed ml-8">{answer}</p>
    </div>
  );
}

// --- Main Page ---

export default async function HomePage() {
  let plans: any[] = [];
  try {
    plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { minAmount: 'asc' }
    });
  } catch (error) {
    console.error("⚠️ HomePage DB Error (Pool Limit?):", error);
  }
  return (
    <div className="bg-zinc-950 text-white min-h-screen selection:bg-blue-600/30">
      {/* Hero */}
      <header className="pt-12 pb-16 px-4 md:pt-24 md:pb-32 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] -z-10 rounded-full opacity-50" />
        <div className="inline-block bg-blue-600/10 border border-blue-600/20 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-bold mb-6 tracking-[0.3em] uppercase">
          ESTABLISHED 2026 • GLOBAL ASSET NETWORK
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 leading-[0.95] tracking-tighter">
          Earning <br className="hidden md:block" />
          <span className="text-blue-600 italic">Redefined.</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
          Deploy your assets into the world&apos;s most advanced high-yield intelligence network. Secure, Instant, and Infinite.
        </p>
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:justify-center">
          <Link href="/register" className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group">
            Get Started Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="bg-zinc-900/80 backdrop-blur border border-zinc-800 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all">
            Access Terminal
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="px-4 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatItem icon={<Users className="text-blue-500" size={20} />} label="Global Nodes" value="12k+" />
          <StatItem icon={<Coins className="text-blue-500" size={20} />} label="Total Inbound" value="Rs. 4.2M" />
          <StatItem icon={<Zap className="text-blue-500" size={20} />} label="Paid To Date" value="Rs. 1.8M" />
          <StatItem icon={<BarChart3 className="text-blue-500" size={20} />} label="Active Stream" value="High" />
        </div>
      </section>

      {/* How It Works */}
      <section id="process" className="px-4 py-24 max-w-7xl mx-auto relative overflow-hidden">
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
             Our <span className="text-blue-600">Protocol</span>
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto text-sm font-bold uppercase tracking-widest underline decoration-blue-500/30">Three steps to initial liquidity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard 
            number="01" 
            title="Register Node" 
            desc="Initialize your account on the secure network. Identity verification is processed in real-time." 
            icon={<Globe size={32} className="text-blue-600" />} 
          />
          <StepCard 
            number="02" 
            title="Deploy Capital" 
            desc="Allocate assets to your chosen intelligence plan. We support multiple crypto-asset streams." 
            icon={<Wallet2 size={32} className="text-blue-600" />} 
          />
          <StepCard 
            number="03" 
            title="Extract Profit" 
            desc="Monitor your daily yield generation. Withdraw your liquidity instantly at any time 24/7." 
            icon={<TrendingUp size={32} className="text-blue-600" />} 
          />
        </div>
      </section>

      {/* Intelligence Tech Section */}
      <section className="px-4 py-32 bg-zinc-900/10 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="bg-blue-600/10 p-4 rounded-3xl w-fit mb-8 border border-blue-600/20">
                <Cpu size={48} className="text-blue-600" />
             </div>
             <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase italic">
                Advanced <br /> <span className="text-blue-600">Intelligence</span> Engine
             </h3>
             <ul className="space-y-6">
                {[
                  "Proprietary AI-driven yield optimization",
                  "Deep-Liquidity mining protocols",
                  "Cross-Chain asset synchronization",
                  "Automated security layer auditing"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-300 font-bold uppercase tracking-widest text-sm">
                    <CheckCircle2 size={18} className="text-blue-500" /> {item}
                  </li>
                ))}
             </ul>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] mt-12">
                 <Lock size={32} className="text-blue-600 mb-4" />
                 <h5 className="font-bold mb-2">Cold Storage</h5>
                 <p className="text-zinc-500 text-xs leading-relaxed">98% of assets are stored in multi-signature cold wallets.</p>
              </div>
              <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem]">
                 <DollarSign size={32} className="text-blue-600 mb-4" />
                 <h5 className="font-bold mb-2">Instant FX</h5>
                 <p className="text-zinc-500 text-xs leading-relaxed">Seamless conversion between native tokens and stablecoins.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic">
              Platform <span className="text-blue-600">Excellence</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-[3rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-all group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors" />
              <ShieldCheck className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic">Ironclad Security</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Multi-layer encryption and real-time monitoring to ensure your capital remains untouchable and growing.</p>
            </div>
            <div className="p-10 rounded-[3rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-all group relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors" />
              <Zap className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic">Hyper-Fast Exit</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Automated extraction corridors process your withdrawals in seconds, not hours. Access your assets anytime.</p>
            </div>
            <div className="p-10 rounded-[3rem] border border-zinc-800 bg-zinc-900/30 hover:border-blue-600/50 transition-all group relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors" />
              <BarChart3 className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic">Yield Mastery</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">AI algorithms find the highest-performing pools across global markets to deliver consistent, daily returns.</p>
            </div>
          </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="px-4 py-24 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-6xl font-black text-center mb-16 uppercase tracking-tighter italic">Investment <span className="text-blue-600">Tiers</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan: any) => (
              <PlanCard 
                key={plan.id}
                title={plan.name} 
                percent={`${plan.roi}%`} 
                days={plan.duration} 
                min={plan.minAmount} 
                max={plan.maxAmount} 
                featured={plan.popular} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-24 max-w-4xl mx-auto">
         <div className="text-center mb-16">
            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">Common <span className="text-blue-600">Queries</span></h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Everything you need to know before deployment</p>
         </div>
         <div className="space-y-4">
            <FAQItem 
              question="What is the minimum deposit?" 
              answer="You can start your investment journey with as little as Rs. 10 on our Starter Pulse plan. There are no hidden fees for deployment." 
            />
            <FAQItem 
              question="How often are profits credited?" 
              answer="Profits are calculated and credited to your terminal balance every 24 hours from the moment your investment plan becomes active." 
            />
            <FAQItem 
              question="Can I withdraw my capital at any time?" 
              answer="Yes. After your selected plan period concludes, your principal capital is released and available for instant withdrawal along with your profits." 
            />
            <FAQItem 
              question="Is my account secure?" 
              answer="We use military-grade encryption and multi-signature authorization for all transactions. Your data and assets are our highest priority." 
            />
         </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-32 text-center relative overflow-hidden border-t border-zinc-900">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
         <h3 className="text-4xl md:text-8xl font-black mb-10 tracking-tighter italic uppercase">Ready to <br /> <span className="text-blue-600">Initialize?</span></h3>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="bg-blue-600 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
               Register Account <ArrowRight size={20} />
            </Link>
            <Link href="/support" className="bg-zinc-900 border border-zinc-800 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
               <MessageSquare size={20} className="text-blue-600" /> Live Support
            </Link>
         </div>
      </section>

      {/* Final Footer */}
      <footer className="py-16 border-t border-zinc-900/50 text-center opacity-60">
        <p className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-[0.4em]">
          © 2026 Exotic Cash Digital Assets • Decentralized Yield Intelligence Protocol
        </p>
      </footer>
    </div>
  );
}
