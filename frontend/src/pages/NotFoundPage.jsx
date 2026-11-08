import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cobalt-600/30 border border-cobalt-500/40 text-electric-cyan flex items-center justify-center mx-auto shadow-glow-cobalt">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-cobalt-400 uppercase">
            Error 404 • Lost in Orbit
          </span>
          <h1 className="text-4xl font-black text-white font-display">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The event stage, game arena, or page you are looking for does not exist or has been relocated in the festival schedule.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs bg-cobalt-600 hover:bg-cobalt-500 text-white shadow-glow-cobalt transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Fest Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
