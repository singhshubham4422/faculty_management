"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Faculty", href: "/faculty" },
        { name: "Events", href: "/events" },
    ];

    const isActive = (path: string) => {
        if (path === "/" && pathname !== "/") return false;
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* 1. UTILITY BAR (Top Thin Bar) */}
            <div className="bg-slate-100 border-b border-slate-200 text-xs py-2">
                <div className="container-academic flex justify-end gap-6 text-slate-600 font-medium">
                    <Link href="/about" className="hover:text-[#003262] transition-colors">About Us</Link>
                    <Link href="/faculty" className="hover:text-[#003262] transition-colors">Faculty Directory</Link>
                    <Link href="/events" className="hover:text-[#003262] transition-colors">Explore Events</Link>
                </div>
            </div>

            {/* 2. MAIN NAVIGATIONAL HEADER */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="container-academic flex h-20 items-center justify-between">

                    {/* BRANDING */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="flex h-12 w-12 items-center justify-center bg-[#003262] text-white font-serif font-bold text-2xl rounded-sm shadow-md group-hover:bg-[#002244] transition-colors">
                            S
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-[#003262] font-serif leading-none group-hover:text-[#002244] transition-colors">
                                SRM ACM SIGAPP
                            </span>
                            <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest group-hover:text-slate-700 transition-colors">
                                Excellence in Computing
                            </span>
                        </div>
                    </Link>

                    {/* PRIMARY NAVIGATION */}
                    <nav className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${isActive(link.href)
                                        ? "border-[#FDB515] text-[#003262]"
                                        : "border-transparent text-slate-500 hover:text-[#003262]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    );
}
