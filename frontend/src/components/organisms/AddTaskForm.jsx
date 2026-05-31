import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export default function AddTaskForm({ isOpen, onClose }) {
  const { addTask } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [dod, setDod] = useState('');
  const [category, setCategory] = useState('MAIN');
  const [energy, setEnergy] = useState('MEDIUM');
  const [interest, setInterest] = useState(3);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      addTask({
        title,
        definition_of_done: dod,
        menu_category: category,
        energy_required: energy,
        interest_level: interest,
      });

      setSuccess(true);
      setTitle('');
      setDod('');
      setCategory('MAIN');
      setEnergy('MEDIUM');
      setInterest(3);
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  const dodLength = dod.trim().length;
  const isDodValid = dodLength >= 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg tech-panel p-6 border border-sky-500/20 shadow-2xl z-10"
          >
            {/* Corner Brackets */}
            <div className="tech-panel-corner corner-tl" />
            <div className="tech-panel-corner corner-tr" />
            <div className="tech-panel-corner corner-bl" />
            <div className="tech-panel-corner corner-br" />

            <div className="flex justify-between items-center mb-6 border-b border-slate-700/60 pb-3">
              <h2 className="text-md font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Sparkles size={16} />
                CREATE_NEW_TASK // INTERACTION
              </h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-800 border border-transparent hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Task Title (Nama Instruksi) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: Tulis draf proposal klien..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-xs placeholder:text-slate-600"
                />
              </div>

              {/* Definition of Done */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Definition of Done (Spesifikasi Selesai) *
                  </label>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none border ${isDodValid ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20' : 'border-slate-700 text-slate-500 bg-slate-900'}`}>
                    {dodLength} / 10 CHARS
                  </span>
                </div>
                <textarea 
                  required
                  rows="3"
                  placeholder="Deskripsikan dengan detail akhir tugas agar tidak membingungkan..."
                  value={dod}
                  onChange={(e) => setDod(e.target.value)}
                  className={`w-full bg-slate-900 border rounded-none px-4 py-2 text-slate-200 focus:outline-none transition-all placeholder:text-slate-600 text-xs leading-relaxed ${
                    isDodValid ? 'border-slate-700 focus:border-sky-500' : 'border-amber-500/50 focus:border-amber-500'
                  }`}
                />
                
                {/* Visual Progress Bar for Dopamine */}
                <div className="w-full h-1 bg-slate-950 rounded-none mt-2 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-300 ${isDodValid ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                    style={{ width: `${Math.min((dodLength / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Kategori Menu</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-xs"
                  >
                    <option value="APPETIZER">APPETIZER (QUICK)</option>
                    <option value="MAIN">MAIN COURSE (CORE)</option>
                    <option value="DESSERT">DESSERT (CREATIVE)</option>
                    <option value="SIDE">SIDE QUEST (ADDITIONAL)</option>
                  </select>
                </div>

                {/* Energy Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Energi Input</label>
                  <select 
                    value={energy} 
                    onChange={(e) => setEnergy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-xs"
                  >
                    <option value="LOW">LOW ENERGY</option>
                    <option value="MEDIUM">MEDIUM ENERGY</option>
                    <option value="HIGH">HIGH ENERGY</option>
                  </select>
                </div>
              </div>

              {/* Interest Level */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  DOPAMINE_VAL: {interest}/5
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="5"
                    value={interest}
                    onChange={(e) => setInterest(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-none appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                  <div className="flex gap-0.5 text-amber-500 font-bold text-sm select-none w-16 justify-end">
                    {'★'.repeat(interest)}{'☆'.repeat(5 - interest)}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-500/30 p-3">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span className="uppercase tracking-wider">{error}</span>
                </div>
              )}

              {success && (
                <div className="text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 p-3 text-center font-bold uppercase tracking-widest">
                  TASK SUCCESSFULLY REGISTERED
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!isDodValid}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isDodValid 
                      ? 'border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-slate-950 shadow-[0_0_8px_rgba(14,165,233,0.2)]' 
                      : 'border-slate-800 text-slate-600 bg-slate-950 cursor-not-allowed'
                  }`}
                >
                  <Plus size={12} className="inline mr-1" />
                  SUBMIT_TASK
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
