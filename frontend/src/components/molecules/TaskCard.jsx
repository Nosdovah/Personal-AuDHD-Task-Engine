import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Shuffle, CheckSquare, Square } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

const categoryColors = {
  APPETIZER: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
  MAIN: 'border-rose-500/30 text-rose-400 bg-rose-950/20',
  DESSERT: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
};

const categoryLabels = {
  APPETIZER: '[APPETIZER / QUICK FIX]',
  MAIN: '[MAIN COURSE / CORE BUILD]',
  DESSERT: '[DESSERT / CREATIVE R&D]',
};

export default function TaskCard({ task }) {
  const { completeTask, triggerTrapdoor } = useTaskStore();
  const [isHoveringDone, setIsHoveringDone] = useState(false);

  const handleComplete = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#06b6d4', '#10b981', '#14b8a6'] // Cyan/Emerald theme
    });

    setTimeout(() => {
      completeTask(task.id);
    }, 400);
  };

  const handleTrapdoor = () => {
    triggerTrapdoor(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: 90, filter: 'blur(10px)' }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col tech-panel border border-slate-700/60 overflow-hidden shadow-2xl relative"
    >
      {/* Corner Brackets for industrial tech styling */}
      <div className="tech-panel-corner corner-tl" />
      <div className="tech-panel-corner corner-tr" />
      <div className="tech-panel-corner corner-bl" />
      <div className="tech-panel-corner corner-br" />

      <div className={`px-4 py-2.5 text-xs font-bold tracking-wider border-b border-slate-700/60 ${categoryColors[task.menu_category]}`}>
        {categoryLabels[task.menu_category]}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-100 mb-4 uppercase tracking-wide leading-snug">{task.title}</h3>
        
        <div className="mt-auto bg-slate-900/60 rounded border border-slate-800 p-4 relative">
          {/* Subtle tech dot pattern or blueprint detail */}
          <div className="absolute top-1.5 right-2 text-[8px] text-slate-600 font-mono">SPEC_01 //</div>
          <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">DEFINITION_OF_DONE:</p>
          <div className="flex items-start gap-3">
            <button 
              className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
              onMouseEnter={() => setIsHoveringDone(true)}
              onMouseLeave={() => setIsHoveringDone(false)}
              onClick={handleComplete}
            >
              {isHoveringDone ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>
            <p className="text-xs text-slate-300 leading-relaxed uppercase">{task.definition_of_done}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/40 border-t border-slate-700/40 flex gap-3">
        <button 
          onClick={handleComplete}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-wider"
        >
          <CheckCircle2 size={14} />
          EXECUTE
        </button>
        
        {task.menu_category === 'MAIN' && (
          <button 
            onClick={handleTrapdoor}
            title="Otak stuck? Trigger Trapdoor ke Dessert!"
            className="flex items-center justify-center px-4 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
          >
            <Shuffle size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
