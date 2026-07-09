import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, AlertTriangle, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 animate-scale-in">
        <div className="bg-surface-ink border border-border p-8 rounded-3xl text-center space-y-6 max-w-md shadow-2xl relative">
          {/* Visual SVG representing typewriter block */}
          <div className="p-4 bg-danger/10 text-danger border border-danger/20 rounded-full w-fit mx-auto animate-bounce">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-extrabold text-white">Something went wrong</h1>
            <p className="text-sm text-muted leading-relaxed">
              The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
            </p>
          </div>

          {/* Retro typewriter monospace characters visual box */}
          {/* <div className="p-4 bg-surface-dark border border-border rounded-xl font-mono text-[10px] text-muted leading-relaxed text-left space-y-1">
            <p className="text-accent font-bold">// Something went wrong</p>
            <p>&gt; spool_directory: /var/log/spool/errors</p>
            <p>&gt; routing_state: 404_PAGE_NOT_FOUND</p>
            <p>&gt; diagnosis: target route does not exist</p>
          </div> */}

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background hover:bg-accent-hover font-semibold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all w-full justify-center shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-background" />
            Go Back Home
          </Link>
        </div>
      </main>

      <footer className="border-t border-border bg-background py-6 text-center text-xs text-muted w-full">
        <p>&copy; {new Date().getFullYear()} PrintEase. Spool Error.</p>
      </footer>
    </div>
  );
};

export default NotFoundPage;
