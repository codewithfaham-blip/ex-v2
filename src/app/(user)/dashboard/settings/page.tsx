"use client";
import { Shield, Lock, Bell, Smartphone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 lg:p-12 pt-28 lg:pt-10 max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">
          System <span className="text-blue-600">Parameters</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">
          Configure your secure node and encryption keys
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Security Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-500">
              <Lock size={20} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic text-white">Authentication Keys</h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Current Password</label>
                <input 
                  type="password" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">New Cyber Key</label>
                <input 
                  type="password" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10">
              Update Security Protocol
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-emerald-600/10 p-3 rounded-2xl text-emerald-500">
              <Bell size={20} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic text-white">System Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {[ "Email Alerts on Payouts", "Login Security Sync", "Marketing Intelligence" ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-900">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{item}</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}