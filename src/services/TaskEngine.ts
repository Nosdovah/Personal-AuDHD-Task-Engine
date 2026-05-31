import { Task, CreateTaskDTO, EnergyLevel, TodayMenuResponse, TaskStatus } from '../types/task';

// Helper generator UUID murni (tidak bergantung pada modul Node atau Browser)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Simulasi database client (misalnya driver Turso / libSQL)
let mockDatabase: Task[] = [];

export class TaskEngine {
  
  /**
   * Fitur C: Anti-Vagueness Guardrail (Validasi Input)
   * Saat menambahkan tugas baru, sistem menolak input jika definition_of_done 
   * kosong atau terlalu pendek (< 10 karakter).
   */
  public createTask(data: CreateTaskDTO): Task {
    if (!data.definition_of_done || data.definition_of_done.trim().length < 10) {
      throw new Error("Anti-Vagueness Guardrail: 'definition_of_done' harus sangat jelas dan minimal 10 karakter untuk menghindari ambiguitas.");
    }
    
    const newTask: Task = {
      id: generateUUID(),
      ...data,
      status: 'BACKLOG',
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    mockDatabase.push(newTask);
    return newTask;
  }

  /**
   * Fitur A: Mekanisme "The Rule of 3" (View Isolation)
   * HANYA menarik maksimal 3 tugas ke 'QUEUE' (1 Appetizer, 1 Main, 1 Dessert) 
   * berdasarkan level energi, lalu mengembalikan layout menu restoran.
   */
  public fetchIsolateMenu(userEnergy: EnergyLevel): TodayMenuResponse {
    // 1. Reset semua tugas yang sedang di 'QUEUE' kembali ke 'BACKLOG' (opsional, tergantung preferensi isolasi harian)
    mockDatabase = mockDatabase.map(t => 
      t.status === 'QUEUE' ? { ...t, status: 'BACKLOG' } : t
    );

    // 2. Filter backlog berdasarkan energy dan interest level
    const backlogs = mockDatabase.filter(t => t.status === 'BACKLOG');
    
    // Fungsi pembantu untuk mengambil 1 task terbaik untuk kategori
    const pickBestTask = (category: string) => {
      // Prioritaskan yang energi-nya cocok terlebih dahulu, lalu yang interest-nya paling tinggi
      const candidates = backlogs.filter(t => t.menu_category === category);
      if (candidates.length === 0) return null;
      
      const perfectMatches = candidates.filter(t => t.energy_required === userEnergy);
      const pool = perfectMatches.length > 0 ? perfectMatches : candidates;
      
      // Sort desc berdasarkan interest_level, ambil yang paling atas
      pool.sort((a, b) => b.interest_level - a.interest_level);
      return pool[0];
    };

    const selectedAppetizer = pickBestTask('APPETIZER');
    const selectedMain = pickBestTask('MAIN');
    const selectedDessert = pickBestTask('DESSERT');
    
    const isolatedIds = [selectedAppetizer?.id, selectedMain?.id, selectedDessert?.id].filter(Boolean);

    // 3. Update status ke 'QUEUE' untuk task yang terpilih
    mockDatabase = mockDatabase.map(t => 
      isolatedIds.includes(t.id) ? { ...t, status: 'QUEUE', updated_at: new Date() } : t
    );

    // 4. Format JSON response untuk UI (Restoran Layout)
    const currentQueue = mockDatabase.filter(t => t.status === 'QUEUE');

    return {
      menu: {
        APPETIZER: currentQueue.filter(t => t.menu_category === 'APPETIZER'),
        MAIN: currentQueue.filter(t => t.menu_category === 'MAIN'),
        DESSERT: currentQueue.filter(t => t.menu_category === 'DESSERT'),
        SIDE: currentQueue.filter(t => t.menu_category === 'SIDE'), // Jika ada side quest
      }
    };
  }

  /**
   * Fitur B: Logika "Boredom Trapdoor" (Task Shuffling)
   * Jika pengguna bosan/mandek pada MAIN task, kembalikan ke BACKLOG, 
   * dan tarik task baru dari kategori 'DESSERT' dengan interest tinggi.
   */
  public triggerTrapdoor(currentTaskId: string): Task | null {
    const taskIndex = mockDatabase.findIndex(t => t.id === currentTaskId);
    if (taskIndex === -1) throw new Error("Tugas tidak ditemukan");

    const task = mockDatabase[taskIndex];
    if (task.menu_category !== 'MAIN') {
      throw new Error("Trapdoor hanya dapat dipicu untuk Main Course (tugas utama) yang menyebabkan kelelahan/stuck.");
    }

    // 1. Ubah task aktif kembali ke BACKLOG
    mockDatabase[taskIndex] = { ...task, status: 'BACKLOG', updated_at: new Date() };

    // 2. Tarik tugas baru dari 'DESSERT' yang interest_level nya tinggi (4 atau 5)
    const dessertCandidates = mockDatabase.filter(t => 
      t.status === 'BACKLOG' && 
      t.menu_category === 'DESSERT' && 
      t.interest_level >= 4
    ).sort((a, b) => b.interest_level - a.interest_level);

    if (dessertCandidates.length === 0) {
      return null; // Tidak ada dessert yang tersedia, mungkin butuh break total.
    }

    const rewardTask = dessertCandidates[0];
    
    // 3. Masukkan ke QUEUE
    mockDatabase = mockDatabase.map(t => 
      t.id === rewardTask.id ? { ...t, status: 'QUEUE', updated_at: new Date() } : t
    );

    return mockDatabase.find(t => t.id === rewardTask.id) || null;
  }
}
