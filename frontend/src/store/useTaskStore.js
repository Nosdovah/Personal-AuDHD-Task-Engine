import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Helper UUID untuk browser jika crypto.randomUUID tidak tersedia
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useTaskStore = create((set, get) => ({
  currentEnergy: null,
  activeTasks: [],
  backlog: [],
  isShuffling: false,
  isLoading: false,

  setEnergy: async (energy) => {
    set({ currentEnergy: energy });
    await get().fetchIsolateMenu(energy);
  },

  fetchIsolateMenu: async (energy) => {
    set({ isLoading: true });
    
    // 1. Tarik semua tugas dari BACKLOG di Supabase
    const { data: backlogData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'BACKLOG');

    if (error) {
      console.error('Error fetching backlog:', error);
      set({ isLoading: false });
      return;
    }

    set({ backlog: backlogData || [] });
    const { backlog } = get();
    
    // Fungsi pembantu untuk The Rule of 3
    const getOne = (category) => {
      const candidates = backlog.filter(t => t.menu_category === category);
      if (candidates.length === 0) return null;
      
      const perfectMatches = candidates.filter(t => t.energy_required === energy);
      const pool = perfectMatches.length > 0 ? perfectMatches : candidates;
      
      pool.sort((a, b) => b.interest_level - a.interest_level);
      return pool[0];
    };
    
    const appetizer = getOne('APPETIZER');
    const main = getOne('MAIN');
    const dessert = getOne('DESSERT');
    
    const newActiveTasks = [appetizer, main, dessert].filter(Boolean);
    const newActiveIds = newActiveTasks.map(t => t.id);

    // 2. Tandai status sebagai QUEUE di database
    if (newActiveIds.length > 0) {
      await supabase
        .from('tasks')
        .update({ status: 'QUEUE' })
        .in('id', newActiveIds);
    }
    
    set({ activeTasks: newActiveTasks, isLoading: false });
  },

  completeTask: async (taskId) => {
    // Optimistic UI update agar confetti tidak terhambat loading
    set((state) => ({
      activeTasks: state.activeTasks.filter(t => t.id !== taskId)
    }));

    // Simpan ke Supabase
    await supabase
      .from('tasks')
      .update({ status: 'COMPLETED' })
      .eq('id', taskId);
  },

  triggerTrapdoor: async (taskId) => {
    set({ isShuffling: true });
    
    // 1. Cari kandidat pengganti dari DESSERT
    const { data: dessertCandidates } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'BACKLOG')
      .eq('menu_category', 'DESSERT')
      .gte('interest_level', 4);
      
    let nextDessert = null;
    if (dessertCandidates && dessertCandidates.length > 0) {
      dessertCandidates.sort((a, b) => b.interest_level - a.interest_level);
      nextDessert = dessertCandidates[0];
    }

    // 2. Eksekusi query mutasi bersamaan
    const updates = [
      supabase.from('tasks').update({ status: 'BACKLOG' }).eq('id', taskId)
    ];
    
    if (nextDessert) {
      updates.push(supabase.from('tasks').update({ status: 'QUEUE' }).eq('id', nextDessert.id));
    }
    
    await Promise.all(updates);

    // 3. Update UI dengan delay animasi 600ms
    setTimeout(() => {
      set((state) => {
        const remaining = state.activeTasks.filter(t => t.id !== taskId);
        if (nextDessert) {
          remaining.push(nextDessert);
        }
        return { activeTasks: remaining, isShuffling: false };
      });
    }, 600);
  },

  addTask: async (task) => {
    if (!task.definition_of_done || task.definition_of_done.trim().length < 10) {
      throw new Error("Anti-Vagueness Guardrail: 'Definition of Done' harus diisi minimal 10 karakter.");
    }
    
    const newTask = {
      id: generateUUID(),
      status: 'BACKLOG',
      interest_level: Number(task.interest_level),
      ...task
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (error) {
      throw new Error(`Gagal menyimpan ke database: ${error.message}`);
    }

    set((state) => ({
      backlog: [...state.backlog, data ? data[0] : newTask]
    }));
  },

  reset: async () => {
    const { activeTasks } = get();
    const activeIds = activeTasks.map(t => t.id);
    
    // Reset tugas yang ditinggalkan (QUEUE) kembali ke BACKLOG di Supabase
    if (activeIds.length > 0) {
      await supabase
        .from('tasks')
        .update({ status: 'BACKLOG' })
        .in('id', activeIds);
    }

    set({ currentEnergy: null, activeTasks: [] });
  }
}));
