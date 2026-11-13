import React from 'react';
import { Database, FileSpreadsheet, Download, ExternalLink, ShieldCheck, BookOpen, Sparkles, LogIn, LogOut, Layers } from 'lucide-react';
import type { User } from 'firebase/auth';

interface NavbarProps {
  totalRows: number;
  totalDocs: number;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onOpenGeminiAnalyzer?: () => void;
  onOpenPdfSummary?: () => void;
  onOpenMasterHub?: () => void;
  cachedCount?: number;
  currentUser?: User | null;
  onSignIn?: () => Promise<User | null>;
  onSignOut?: () => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalRows: _totalRows,
  totalDocs: _totalDocs,
  onExportExcel,
  onExportCsv,
  onExportJson,
  onOpenGeminiAnalyzer,
  onOpenPdfSummary,
  onOpenMasterHub,
  cachedCount = 0,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Repo Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crimson-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-950/40 border border-red-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  नेपाल कानून, संबिधान र मुलुकी संहिता डेटा पोर्टल
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  प्रमाणित डेटा
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  MD रिडर + PDF सिंक
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  Repo: <a href="https://github.com/barshapbp2026/any-pdf-" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-0.5 font-semibold">barshapbp2026/any-pdf- <ExternalLink className="w-2.5 h-2.5" /></a>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">कानूनी अभिलेख तथा १०-स्तम्भ डेटा समक्रमण</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: AI Tools, Master Store, Auth & Exports */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenMasterHub && (
              <button
                onClick={onOpenMasterHub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-md shadow-amber-950/40 border border-amber-300/40 transition-all active:scale-95 cursor-pointer"
                title="मास्टर सारांश स्टोर र ब्याच जेनरेटर (Firestore + LFS ब्याकअप)"
              >
                <Layers className="w-3.5 h-3.5 text-amber-100" />
                <span>मास्टर स्टोर</span>
                {cachedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-950/35 text-[10px] font-bold text-amber-100">
                    {cachedCount}
                  </span>
                )}
              </button>
            )}
            {onOpenPdfSummary && (
              <button
                onClick={onOpenPdfSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40 transition-all active:scale-95 cursor-pointer"
                title="AI Powered PDF Summarizer (Gemini 4 Hydrogen)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>AI PDF सारांश</span>
              </button>
            )}
            {onOpenGeminiAnalyzer && (
              <button
                onClick={onOpenGeminiAnalyzer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/40 transition-all active:scale-95 cursor-pointer"
                title="AI Powered Legal Header & Style Analysis (Gemini 4 Hydrogen)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI हेडर विश्लेषक</span>
              </button>
            )}

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Export all rows to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Export all rows to CSV (with UTF-8 Devanagari BOM)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Export all rows to JSON"
            >
              <span>JSON</span>
            </button>

            {onSignIn && !currentUser && (
              <button
                onClick={() => void onSignIn()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
                title="मास्टर स्टोरमा सारांश सेभ गर्न Google Sign-In गर्नुहोस्"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign-In</span>
              </button>
            )}
            {currentUser && onSignOut && (
              <button
                onClick={() => void onSignOut()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title={`Signed in as ${currentUser.email || 'User'} — Sign out`}
              >
                <span className="max-w-[110px] truncate text-emerald-300 font-semibold">
                  {currentUser.displayName || currentUser.email || 'Signed In'}
                </span>
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
