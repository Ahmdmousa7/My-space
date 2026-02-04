import React, { useState } from 'react';
import { LinkItem, SheetItem } from '../types';
import { Plus, Trash2, Globe, ExternalLink, Search, Tag, Sheet } from 'lucide-react';

interface LinksViewProps {
  type: 'links' | 'sheets';
  items: (LinkItem | SheetItem)[];
  setItems: (items: any[]) => void;
}

export const LinksView: React.FC<LinksViewProps> = ({ type, items, setItems }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [filter, setFilter] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newItem = type === 'links' 
      ? { id, title: newTitle || newUrl, url: newUrl, category: newCategory || 'General', createdAt: Date.now() }
      : { id, title: newTitle || 'Untitled Sheet', url: newUrl, lastOpened: Date.now() };

    setItems([newItem, ...items]);
    setNewUrl('');
    setNewTitle('');
    setNewCategory('');
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) || 
    item.url.toLowerCase().includes(filter.toLowerCase()) ||
    ('category' in item && (item as LinkItem).category.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          {type === 'links' ? 'Links Library' : 'Google Sheets'}
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {type === 'links' ? 'Link' : 'Sheet'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={addItem} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8 animate-fade-in-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={type === 'links' ? "My Resource" : "Project Budget"}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {type === 'links' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Work, Personal, Dev..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`Search ${type}...`}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow relative">
             <div className="flex items-start justify-between mb-2">
               <div className={`p-2 rounded-lg ${type === 'links' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                 {type === 'links' ? <Globe className="w-5 h-5" /> : <Sheet className="w-5 h-5" />}
               </div>
               <div className="flex gap-2">
                 <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
             
             <h3 className="font-semibold text-slate-800 mb-1 truncate pr-2">{item.title}</h3>
             <a 
               href={item.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-xs text-slate-400 mb-3 block truncate hover:text-indigo-600"
             >
               {item.url}
             </a>

             <div className="flex items-center justify-between mt-4">
                {'category' in item && (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    <Tag className="w-3 h-3" />
                    {(item as LinkItem).category}
                  </span>
                )}
                {type === 'sheets' && (
                  <span className="text-xs text-slate-400">Google Sheet</span>
                )}
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="ml-auto flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
             </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-400">
           <p>No items found.</p>
        </div>
      )}
    </div>
  );
};