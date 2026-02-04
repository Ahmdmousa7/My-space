export type TabId = 'dashboard' | 'tasks' | 'links' | 'sheets' | 'notes' | 'smart-capture';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: number;
}

export interface SheetItem {
  id: string;
  title: string;
  url: string;
  lastOpened?: number;
}

export interface StickyNote {
  id: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
  x: number;
  y: number;
  createdAt: number;
}

export interface AppState {
  tasks: Task[];
  links: LinkItem[];
  sheets: SheetItem[];
  notes: StickyNote[];
  lastUpdated?: number;
}

export const COLORS = {
  yellow: 'bg-yellow-100 border-yellow-200 text-yellow-900',
  blue: 'bg-blue-100 border-blue-200 text-blue-900',
  green: 'bg-green-100 border-green-200 text-green-900',
  red: 'bg-red-100 border-red-200 text-red-900',
  purple: 'bg-purple-100 border-purple-200 text-purple-900',
};