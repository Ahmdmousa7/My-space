import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TasksView } from './components/TasksView';
import { LinksView } from './components/LinksView';
import { StickyNotesView } from './components/StickyNotesView';
import { SmartCapture } from './components/SmartCapture';
import { AppState, TabId } from './types';
import { loadState, saveState } from './services/storage';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [data, setData] = useState<AppState>(loadState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persist state changes
  useEffect(() => {
    saveState(data);
  }, [data]);

  const updateData = (updates: Partial<AppState>) => {
    setData(prev => {
      const newState = { ...prev };
      if (updates.tasks) newState.tasks = [...updates.tasks, ...prev.tasks];
      if (updates.links) newState.links = [...updates.links, ...prev.links];
      if (updates.sheets) newState.sheets = [...updates.sheets, ...prev.sheets];
      if (updates.notes) newState.notes = [...updates.notes, ...prev.notes];
      return newState;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} onChangeTab={setActiveTab} />;
      case 'smart-capture':
        return <SmartCapture onProcess={updateData} onChangeTab={setActiveTab} />;
      case 'tasks':
        return <TasksView tasks={data.tasks} setTasks={tasks => setData({ ...data, tasks })} />;
      case 'links':
        return <LinksView type="links" items={data.links} setItems={links => setData({ ...data, links })} />;
      case 'sheets':
        return <LinksView type="sheets" items={data.sheets} setItems={sheets => setData({ ...data, sheets })} />;
      case 'notes':
        return <StickyNotesView notes={data.notes} setNotes={notes => setData({ ...data, notes })} />;
      default:
        return <Dashboard data={data} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
               <Menu className="w-6 h-6" />
             </button>
             <span className="font-bold text-slate-800">Ahmed Mo Space</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;