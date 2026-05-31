import React from 'react';
import { motion } from 'framer-motion';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export default function EnergyCheckIn() {
  const setEnergy = useTaskStore((state) => state.setEnergy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full tech-panel p-6 border border-sky-500/20 shadow-2xl relative"
      >
        {/* Corner Brackets for tech aesthetic */}
        <div className="tech-panel-corner corner-tl" />
        <div className="tech-panel-corner corner-tr" />
        <div className="tech-panel-corner corner-bl" />
        <div className="tech-panel-corner corner-br" />

        <div className="flex items-center justify-between text-xs text-sky-400 font-bold border-b border-sky-500/20 pb-3 mb-6">
          <span>SYS_STATUS: READY</span>
          <span>CALIBRATE_INPUT //</span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-slate-100 uppercase tracking-wider">
          CALIBRATE POWER INPUT
        </h1>
        <p className="text-slate-400 text-xs mb-8 leading-relaxed">
          Pilih level energi Anda saat ini untuk menyesuaikan konfigurasi menu tugas secara otomatis.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setEnergy('LOW')}
            className="flex items-center justify-between w-full py-4 px-6 bg-slate-900/60 border border-slate-700 hover:border-emerald-500 hover:bg-slate-900 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <BatteryLow className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wider text-slate-200">LOW_ENERGY</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 led-glow-emerald" />
          </button>
          
          <button 
            onClick={() => setEnergy('MEDIUM')}
            className="flex items-center justify-between w-full py-4 px-6 bg-slate-900/60 border border-slate-700 hover:border-amber-500 hover:bg-slate-900 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <BatteryMedium className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wider text-slate-200">MEDIUM_ENERGY</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 led-glow-amber" />
          </button>
          
          <button 
            onClick={() => setEnergy('HIGH')}
            className="flex items-center justify-between w-full py-4 px-6 bg-slate-900/60 border border-slate-700 hover:border-rose-500 hover:bg-slate-900 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <BatteryFull className="text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wider text-slate-200">HIGH_ENERGY</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 led-glow-rose" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
