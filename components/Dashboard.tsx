import React from 'react';
import { AppState, TabId } from '../types';
import { Activity, CheckCircle, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface DashboardProps {
  data: AppState;
  onChangeTab: (tab: TabId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onChangeTab }) => {
  const pendingTasks = data.tasks.filter(t => !t.completed).length;
  const highPriority = data.tasks.filter(t => !t.completed && t.priority === 'high').length;
  const recentLinks = data.links.slice(0, 5);
  const recentSheets = data.sheets.slice(0, 3);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back!</h1>
        <p className="text-slate-500 mt-2">Here is your personal workspace overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onChangeTab('tasks')}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{pendingTasks}</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <CheckCircle className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          {highPriority > 0 && (
            <p className="text-sm text-red-500 mt-4 font-medium">{highPriority} High Priority</p>
          )}
        </div>

        <div 
          onClick={() => onChangeTab('links')}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Saved Links</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data.links.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <LinkIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
           onClick={() => onChangeTab('sheets')}
           className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Sheets</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data.sheets.length}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onChangeTab('notes')}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Sticky Notes</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data.notes.length}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Sheets */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Recent Sheets
          </h2>
          <div className="space-y-3">
            {recentSheets.length === 0 ? (
               <p className="text-slate-400 text-sm">No sheets added yet.</p>
            ) : (
              recentSheets.map(sheet => (
                <a 
                  key={sheet.id} 
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <span className="font-medium text-slate-700 truncate">{sheet.title}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </a>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            Recent Links
          </h2>
          <div className="space-y-3">
            {recentLinks.length === 0 ? (
               <p className="text-slate-400 text-sm">No links added yet.</p>
            ) : (
              recentLinks.map(link => (
                <a 
                  key={link.id} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <div className="overflow-hidden">
                     <span className="font-medium text-slate-700 block truncate">{link.title}</span>
                     <span className="text-xs text-slate-400 block truncate">{link.url}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-2" />
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};