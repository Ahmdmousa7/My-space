import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { processSmartCapture } from '../services/geminiService';
import { AppState, TabId } from '../types';

interface SmartCaptureProps {
  onProcess: (data: Partial<AppState>) => void;
  onChangeTab: (tab: TabId) => void;
}

export const SmartCapture: React.FC<SmartCaptureProps> = ({ onProcess, onChangeTab }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setError('');

    try {
      const result = await processSmartCapture(input);
      if (result) {
        // Transform the result into AppState compatible format with IDs
        const processedData: any = {};
        
        if (result.tasks?.length) {
            processedData.tasks = result.tasks.map((t: any) => ({
                id: crypto.randomUUID(),
                title: t.title,
                completed: false,
                priority: t.priority || 'medium',
                createdAt: Date.now()
            }));
        }
        if (result.links?.length) {
            processedData.links = result.links.map((l: any) => ({
                id: crypto.randomUUID(),
                title: l.title || l.url,
                url: l.url,
                category: l.category || 'Unsorted',
                createdAt: Date.now()
            }));
        }
        if (result.sheets?.length) {
            processedData.sheets = result.sheets.map((s: any) => ({
                id: crypto.randomUUID(),
                title: s.title || 'New Sheet',
                url: s.url,
                lastOpened: Date.now()
            }));
        }
        if (result.notes?.length) {
            processedData.notes = result.notes.map((n: any) => ({
                id: crypto.randomUUID(),
                content: n.content,
                color: n.color || 'yellow',
                x: 0,
                y: 0,
                createdAt: Date.now()
            }));
        }

        onProcess(processedData);
        setInput('');
        // Maybe navigate to dashboard to see results or show success toast
        // onChangeTab('dashboard'); 
      }
    } catch (e) {
      setError('Failed to process. Please check your API key or try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="text-center mb-8">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Smart Capture</h2>
        <p className="text-slate-500 mt-2 text-lg">
          Paste chaos, get order. Dump your links, tasks, and thoughts here.
          The AI will sort them into the right tabs for you.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-lg border border-indigo-100 relative group focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g. Meeting tomorrow at 10am, check https://figma.com, buy milk, google sheet: https://docs.google.com/spreadsheets/d/123..."
          className="w-full h-40 p-4 rounded-xl border-none outline-none resize-none text-lg text-slate-700 placeholder-slate-300"
          disabled={isProcessing}
        />
        <div className="flex justify-between items-center px-4 pb-2">
            <span className="text-xs text-slate-400 font-medium">Powered by Gemini 3 Flash</span>
            <button
            onClick={handleProcess}
            disabled={!input.trim() || isProcessing}
            className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
                ${!input.trim() || isProcessing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg translate-y-0 active:translate-y-0.5'
                }
            `}
            >
            {isProcessing ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sorting...
                </>
            ) : (
                <>
                Organize
                <ArrowRight className="w-5 h-5" />
                </>
            )}
            </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center animate-pulse">
          {error}
        </div>
      )}

      {/* Examples */}
      {!input && (
         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-3 mb-2 text-sm text-slate-600 italic">"Call John at 5, https://docs.google.com/spreadsheets/d/abc for budget, remember to pay rent"</div>
                <p className="text-xs text-slate-400">Splits into Task, Sheet, and Task</p>
            </div>
            <div className="text-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-3 mb-2 text-sm text-slate-600 italic">"Design inspiration: https://dribbble.com, https://awwwards.com"</div>
                <p className="text-xs text-slate-400">Creates multiple Links</p>
            </div>
            <div className="text-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-3 mb-2 text-sm text-slate-600 italic">"Idea for app: a dog walker uber"</div>
                <p className="text-xs text-slate-400">Creates a Sticky Note</p>
            </div>
         </div>
      )}
    </div>
  );
};