import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TasksView } from './components/TasksView';
import { LinksView } from './components/LinksView';
import { StickyNotesView } from './components/StickyNotesView';
import { SmartCapture } from './components/SmartCapture';
import { AppState, TabId } from './types';
import { loadState, saveState, subscribeToState } from './services/storage';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [data, setData] = useState<AppState>(loadState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced save function to prevent flooding the network
  useEffect(() => {
    // Skip if loading or initially empty
    if (isLoading) return;

    setIsSaving(true);
    const timeoutId = setTimeout(() => {
      saveState(data).then(() => setIsSaving(false));
    }, 1000); // Wait 1 second after last change before saving

    return () => clearTimeout(timeoutId);
  }, [data, isLoading]);

  // Subscribe to real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Initial load and listen for changes
    subscribeToState((newData) => {
      // Conflict Resolution:
      // If the incoming data is OLDER than what we have locally (because we are typing), ignore it.
      // This prevents the "reverting" bug.
      setData(currentData => {
        const localTime = currentData.lastUpdated || 0;
        const cloudTime = newData.lastUpdated || 0;

        // If we are actively saving/typing, and cloud data isn't significantly newer, ignore it
        // But always accept it if it's the very first load
        if (isLoading) {
          setTimeout(() => setIsLoading(false), 500); // Small delay to smooth UX
          return JSON.parse(JSON.stringify(newData));
        }

        // If cloud is newer, take it. 
        if (cloudTime > localTime) {
          return JSON.parse(JSON.stringify(newData));
        }

        // Otherwise, keep our local version
        return currentData;
      });
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoading]);

  // Helper to update local state. The effect above handles saving.
  const handleStateUpdate = (newData: AppState) => {
    // Update local immediately for responsiveness
    setData({ ...newData, lastUpdated: Date.now() });
  };

  const updateData = (updates: Partial<AppState>) => {
    setData(prev => {
      const newState = { ...prev, ...updates, lastUpdated: Date.now() };
      // Handle array merging manualy to be safe? 
      // Actually simpler to just rely on the spread above for this MVP
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
        return <TasksView tasks={data.tasks} setTasks={tasks => handleStateUpdate({ ...data, tasks })} />;
      case 'links':
        return <LinksView type="links" items={data.links} setItems={links => handleStateUpdate({ ...data, links })} />;
      case 'sheets':
        return <LinksView type="sheets" items={data.sheets} setItems={sheets => handleStateUpdate({ ...data, sheets })} />;
      case 'notes':
        return <StickyNotesView notes={data.notes} setNotes={notes => handleStateUpdate({ ...data, notes })} />;
      default:
        return <Dashboard data={data} onChangeTab={setActiveTab} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium mb-4">Authenticating & Connecting to Cloud...</p>

          <div className="text-sm text-slate-500 bg-white p-4 rounded-lg border border-slate-200 shadow-sm animate-in fade-in duration-1000 slide-in-from-bottom-4" style={{ animationDelay: '5s', animationFillMode: 'both' }}>
            <p className="font-semibold text-orange-600 mb-2">Taking too long?</p>
            <p className="mb-2">If this spinner doesn't stop, it usually means:</p>
            <ul className="list-disc text-left pl-5 space-y-1 mb-2">
              <li>You created the Firebase Project but <b>didn't create the Firestore Database</b>.</li>
              <li>Or your internet is blocking the connection.</li>
            </ul>
            <p>Please go to your <a href="https://console.firebase.google.com/" target="_blank" className="text-indigo-600 underline">Firebase Console</a> &rarr; Build &rarr; Firestore Database and make sure it exists!</p>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="font-bold text-slate-800">
              Ahmed Mo Space
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Cloud V1</span>
            </span>
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