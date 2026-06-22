import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 font-mono text-xs">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-slate-500">
          <div>© [{year}] ROOM_BOOKING_LOG.</div>

          <div className="flex flex-wrap gap-4">
            <Link href="/docs" className="hover:text-cyan-400 transition-colors">
              // docs
            </Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">
              // about
            </Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              // privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}