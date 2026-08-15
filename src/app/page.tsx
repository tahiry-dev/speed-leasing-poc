import LeaseSimulator from '../components/LeaseSimulator';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold tracking-tight text-lg text-white">
              SPEED<span className="text-amber-500">LEASING</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-400">
            <span className="hidden sm:inline">Concierge: +1 (800) 555-SPEED</span>
            <button className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-white hover:border-amber-500 transition-colors">
              Client Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 py-6">
        <LeaseSimulator />
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-600">
        <p>© 2026 Speed Leasing Inc. All financial simulations are subject to credit approval.</p>
      </footer>
    </main>
  );
}