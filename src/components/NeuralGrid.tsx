"use client";

import { useEffect, useState } from "react";

export default function NeuralGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 grid grid-cols-12 grid-rows-8 gap-1.5 opacity-20">
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="h-full bg-zinc-900 rounded-[2px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-12 grid-rows-8 gap-1.5 overflow-hidden">
      {Array.from({ length: 96 }).map((_, i) => (
        <div 
          key={i} 
          className={`h-full rounded-[2px] transition-all duration-[2000ms] ${
            Math.random() > 0.95 ? 'bg-blue-600 shadow-[0_0_15px_#3b82f6] scale-110' : 
            Math.random() > 0.8 ? 'bg-zinc-700/50' : 'bg-zinc-900'
          }`} 
        />
      ))}
    </div>
  );
}
