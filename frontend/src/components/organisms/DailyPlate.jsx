import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import TaskCard from '../molecules/TaskCard';
import AddTaskForm from './AddTaskForm';

export default function DailyPlate() {
  const { activeTasks, reset } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col justify-start">
      <header className="tech-panel p-5 border border-sky-500/20 mb-8 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Corner Brackets */}
        <div className="tech-panel-corner corner-tl" />
        <div className="tech-panel-corner corner-tr" />
        <div className="tech-panel-corner corner-bl" />
        <div className="tech-panel-corner corner-br" />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 led-glow-emerald animate-pulse" />
            <h1 className="text-xl font-bold uppercase tracking-wider text-sky-400">
              TASK CONSOLE // DAILY PLATE
            </h1>
          </div>
          <p className="text-slate-400 text-xs tracking-wide">
            Fokus pada isolasi 3 instruksi aktif berikut. Abaikan yang lain untuk mencegah overload.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 text-xs px-4 py-2 border border-sky-500 text-sky-400 hover:bg-sky-500/10 transition-all font-semibold uppercase tracking-wider shadow-[0_0_8px_rgba(14,165,233,0.2)]"
          >
            <Plus size={14} />
            ADD_TASK
          </button>
          <button 
            onClick={reset}
            className="text-xs px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider"
          >
            RESET_SYS
          </button>
        </div>
      </header>

      <AddTaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      <div className="flex-grow flex flex-col justify-center">
        {activeTasks.length === 0 ? (
          <div className="tech-panel p-12 border border-slate-700 text-center relative max-w-md mx-auto w-full">
            <div className="tech-panel-corner corner-tl" />
            <div className="tech-panel-corner corner-tr" />
            <div className="tech-panel-corner corner-bl" />
            <div className="tech-panel-corner corner-br" />
            
            <p className="text-emerald-400 font-bold uppercase tracking-widest mb-2">ALL JOBS COMPLETED</p>
            <p className="text-xs text-slate-400 leading-relaxed uppercase">
              Semua instruksi aktif diselesaikan. Energi terisi penuh. Waktunya istirahat atau reload.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
