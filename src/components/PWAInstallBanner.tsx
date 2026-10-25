import React, { useState } from 'react';
import { Download, Smartphone, Share2, Check, ExternalLink, X, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  // If already opened as installed standalone app on Android, hide the installation banner
  if (isInstalled) {
    return null;
  }

  const handleShareLink = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StudyDuo - Private Chat',
          text: 'Join me on StudyDuo! 100% free private chat and Class 10 study tracker.',
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-slate-900 border border-purple-800/50 p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Smartphone className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                Install on Android (100% Free)
              </h3>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 rounded-full">
                ₹0 Cost
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Add StudyDuo to your & your friend's phone home screen. Works like a native app.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-900/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          ) : (
            <button
              onClick={() => setShowGuide(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/60 text-purple-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>How to Install</span>
            </button>
          )}

          <button
            onClick={handleShareLink}
            title="Share app link with friend"
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-300" />
                <span>Share with Friend</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Android Installation Help Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Free Android Installation
                </h3>
                <p className="text-xs text-slate-400">
                  No Play Store, no payment, no billing needed!
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Open this link in <strong>Google Chrome</strong> on your Android phone.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Tap the Chrome menu button <strong>(the 3 dots ⋮ at the top right)</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  4
                </span>
                <p>
                  Tap <strong>Install</strong>. StudyDuo will appear on your phone's home screen with its own icon, opening full-screen like any standard Android app!
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <button
                onClick={handleShareLink}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link for Friend'}</span>
              </button>

              <button
                onClick={() => setShowGuide(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
