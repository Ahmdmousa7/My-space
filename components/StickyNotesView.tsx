import React from 'react';
import { StickyNote, COLORS } from '../types';
import { Plus, X } from 'lucide-react';

interface StickyNotesViewProps {
  notes: StickyNote[];
  setNotes: (notes: StickyNote[]) => void;
}

export const StickyNotesView: React.FC<StickyNotesViewProps> = ({ notes, setNotes }) => {

  const addNote = () => {
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      content: '',
      color: 'yellow',
      x: 0,
      y: 0,
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const changeColor = (id: string, color: StickyNote['color']) => {
    setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
  };

  return (
    <div className="p-6 h-full min-h-[calc(100vh-2rem)]">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800">Sticky Board</h2>
        <button
          onClick={addNote}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {notes.map(note => (
          <div
            key={note.id}
            className={`group relative p-5 rounded-xl shadow-md border transition-transform hover:-translate-y-1 ${COLORS[note.color]} h-64 flex flex-col`}
          >
            <div className="flex justify-between items-start mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {(['yellow', 'blue', 'green', 'red', 'purple'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => changeColor(note.id, c)}
                    className={`w-4 h-4 rounded-full border border-black/10 ${c === note.color ? 'ring-2 ring-black/20' : ''}`}
                    style={{ backgroundColor: c === 'yellow' ? '#fef3c7' : c === 'blue' ? '#dbeafe' : c === 'green' ? '#d1fae5' : c === 'red' ? '#fee2e2' : '#e9d5ff' }}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, e.target.value)}
              placeholder="Type your note here..."
              className="w-full h-full bg-transparent border-none resize-none outline-none text-base leading-relaxed placeholder-black/30 font-medium"
            />
            <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => deleteNote(note.id)} className="p-1 bg-white/50 rounded-full hover:bg-white/80">
                <X className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};