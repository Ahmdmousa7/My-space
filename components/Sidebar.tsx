import React from 'react';
import { TabId } from '../types';
import { LayoutDashboard, CheckSquare, Link as LinkIcon, FileSpreadsheet, StickyNote, Sparkles, Menu } from 'lucide-react';

interface SidebarProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChangeTab, isOpen, setIsOpen }) => {
  const menuItems: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'smart-capture', icon: Sparkles, label: 'Smart Capture' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'links', icon: LinkIcon, label: 'Links' },
    { id: 'sheets', icon: FileSpreadsheet, label: 'Sheets' },
    { id: 'notes', icon: StickyNote, label: 'Sticky Notes' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-slate-300
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">AM</span>
            </div>
            Ahmed Mo Space
          </h1>
          <p className="text-xs text-slate-500 mt-2">Your personal workspace.</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
               <div>
                   <p className="text-sm font-medium text-white">Ahmed Mo</p>
                   <p className="text-xs text-slate-500">Workspace Admin</p>
               </div>
           </div>
        </div>
      </div>
    </>
  );
};