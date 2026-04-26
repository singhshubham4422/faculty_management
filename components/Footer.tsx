import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#003262] text-white py-12 mt-auto border-t-4 border-[#FDB515]">
      <div className="container-academic flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-xl font-serif font-bold text-white mb-2">SRM ACM SIGAPP Student Chapter</h2>
          <p className="text-slate-300 text-sm">© 2026 All Rights Reserved.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium uppercase tracking-wide">
          <Link href="/about" className="text-slate-200 hover:text-[#FDB515] transition-colors">About</Link>
          <Link href="/faculty" className="text-slate-200 hover:text-[#FDB515] transition-colors">Faculty</Link>
          <Link href="/events" className="text-slate-200 hover:text-[#FDB515] transition-colors">Events</Link>
          <Link href="/developers" className="text-slate-200 hover:text-[#FDB515] transition-colors">Developers</Link>
        </nav>
      </div>
    </footer>
  );
}
