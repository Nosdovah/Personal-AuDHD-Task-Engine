export type MenuCategory = 'APPETIZER' | 'MAIN' | 'DESSERT' | 'SIDE';
export type EnergyLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'BACKLOG' | 'QUEUE' | 'COMPLETED' | 'ABANDONED';

export interface Task {
  id: string;
  title: string;
  definition_of_done: string;
  menu_category: MenuCategory;
  energy_required: EnergyLevel;
  interest_level: number; // 1-5
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  definition_of_done: string;
  menu_category: MenuCategory;
  energy_required: EnergyLevel;
  interest_level: number;
}

export interface TodayMenuResponse {
  menu: {
    APPETIZER: Task[];
    MAIN: Task[];
    DESSERT: Task[];
    SIDE: Task[];
  };
}
