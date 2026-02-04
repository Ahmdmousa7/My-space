import React, { useState } from 'react';
import { Task, COLORS } from '../types';
import { Plus, Check, Trash2, Calendar, Search, Filter, ArrowUpDown, Pencil, X, Save, Repeat } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const TASK_COLOR_MAP: Record<string, string> = {
  yellow: 'border-l-4 border-yellow-400 bg-yellow-50',
  blue: 'border-l-4 border-blue-400 bg-blue-50',
  green: 'border-l-4 border-green-400 bg-green-50',
  red: 'border-l-4 border-red-400 bg-red-50',
  purple: 'border-l-4 border-purple-400 bg-purple-50',
  default: 'border-l-4 border-transparent bg-white',
};

export const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<Task['recurrence'] | undefined>(undefined);
  const [color, setColor] = useState<Task['color'] | undefined>(undefined);

  // Edit Task State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<Task['priority']>('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [editRecurrence, setEditRecurrence] = useState<Task['recurrence'] | undefined>(undefined);
  const [editColor, setEditColor] = useState<Task['color'] | undefined>(undefined);

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'dueDate'>('newest');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      recurrence,
      color: color,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setDueDate('');
    setRecurrence(undefined);
    setColor(undefined);
  };

  const calculateNextDueDate = (currentDateStr: string | undefined, interval: 'daily' | 'weekly' | 'monthly'): string => {
      const date = currentDateStr ? new Date(currentDateStr) : new Date();
      // Handle timezone offset simply by using local time components or forcing noon
      // For simplicity in this demo, let's just use standard date object
      
      if (interval === 'daily') date.setDate(date.getDate() + 1);
      if (interval === 'weekly') date.setDate(date.getDate() + 7);
      if (interval === 'monthly') date.setMonth(date.getMonth() + 1);
      
      return date.toISOString().split('T')[0];
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    let updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: newCompleted } : t);

    // If task is being completed and has a recurrence pattern
    if (newCompleted && task.recurrence) {
        const nextDueDate = calculateNextDueDate(task.dueDate, task.recurrence);
        
        const nextTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            completed: false,
            dueDate: nextDueDate,
            createdAt: Date.now(), 
            // Keep the same recurrence, title, priority, color
        };

        // Add next task to the top of the list
        updatedTasks = [nextTask, ...updatedTasks];
    }

    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setEditRecurrence(task.recurrence);
    setEditColor(task.color);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    
    setTasks(tasks.map(t => t.id === editingId ? {
      ...t,
      title: editTitle,
      priority: editPriority,
      dueDate: editDueDate || undefined,
      recurrence: editRecurrence,
      color: editColor
    } : t));
    setEditingId(null);
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' ? task.completed : !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt - a.createdAt;
    if (sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (sortBy === 'priority') {
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return 0;
  });

  const availableColors: NonNullable<Task['color']>[] = ['yellow', 'blue', 'green', 'red', 'purple'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        Tasks
        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} Remaining
        </span>
      </h2>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="h-6 w-px bg-slate-200 self-center mx-1"></div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex gap-3 mb-3">
            <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-slate-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
            type="submit"
            className="bg-indigo-600 text-white p-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
            </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-slate-500">Priority:</span>
                <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="bg-slate-50 border-none rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-slate-500">Due:</span>
                <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-slate-50 border-none rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <span className="text-slate-500">Repeat:</span>
                <select
                value={recurrence || ''}
                onChange={(e) => setRecurrence(e.target.value ? e.target.value as Task['recurrence'] : undefined)}
                className="bg-slate-50 border-none rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
                <span className="text-slate-500">Color:</span>
                <div className="flex gap-1.5">
                    {availableColors.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(color === c ? undefined : c)}
                            className={`w-5 h-5 rounded-full border border-slate-200 transition-transform ${
                                color === c ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: `var(--color-${c}-300, ${c === 'yellow' ? '#fde047' : c === 'blue' ? '#93c5fd' : c === 'green' ? '#86efac' : c === 'red' ? '#fca5a5' : '#d8b4fe'})` }}
                        />
                    ))}
                    {color && (
                        <button 
                            type="button" 
                            onClick={() => setColor(undefined)} 
                            className="text-xs text-slate-400 hover:text-red-500 ml-1"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map(task => {
          if (editingId === task.id) {
            // Edit Mode Row
            return (
              <div key={task.id} className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm animate-fade-in">
                 <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      autoFocus
                    />
                 </div>
                 <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Priority:</span>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
                          className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Due:</span>
                        <input 
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Repeat:</span>
                        <select
                        value={editRecurrence || ''}
                        onChange={(e) => setEditRecurrence(e.target.value ? e.target.value as Task['recurrence'] : undefined)}
                        className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                        <option value="">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Color:</span>
                        <div className="flex gap-1.5">
                            {availableColors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setEditColor(editColor === c ? undefined : c)}
                                    className={`w-5 h-5 rounded-full border border-slate-200 transition-transform ${
                                        editColor === c ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: `var(--color-${c}-300, ${c === 'yellow' ? '#fde047' : c === 'blue' ? '#93c5fd' : c === 'green' ? '#86efac' : c === 'red' ? '#fca5a5' : '#d8b4fe'})` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="ml-auto flex gap-2">
                      <button 
                        onClick={cancelEditing}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                         <X className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={saveEdit}
                        className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                         <Save className="w-5 h-5" />
                      </button>
                    </div>
                 </div>
              </div>
            );
          }

          // View Mode Row
          return (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                task.color ? TASK_COLOR_MAP[task.color] : 'bg-white'
              } ${
                task.completed 
                  ? 'border-slate-100 opacity-60 bg-slate-50' 
                  : 'border-slate-200 hover:border-indigo-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white scale-100'
                      : 'border-slate-300 text-transparent hover:border-indigo-500 bg-white hover:scale-110'
                  }`}
                >
                  <Check className={`w-4 h-4 transition-transform duration-200 ${task.completed ? 'scale-100' : 'scale-0'}`} />
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate transition-all duration-300 ${task.completed ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.recurrence && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                        <Repeat className="w-3 h-3" />
                        {task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEditing(task)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
                <p>No tasks match your filters.</p>
                <button 
                    onClick={() => {setSearchQuery(''); setFilterPriority('all'); setFilterStatus('all');}} 
                    className="text-indigo-500 text-sm hover:underline mt-2"
                >
                    Clear filters
                </button>
            </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No tasks yet. Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  );
};