"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Profile = {
  full_name: string | null;
  role: string;
};

type HeaderProps = {
  variant?: "default" | "home";
  activeTab?: "research" | "acm" | "events";
  onTabChange?: (tab: "research" | "acm" | "events") => void;
};

export default function Header({ variant = "default", activeTab = "research", onTabChange }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
      if (u) {
        const { data: p } = await supabase.from("profiles").select("full_name, role").eq("id", u.id).single();
        setProfile(p ?? null);
      } else {
        setProfile(null);
      }
      setAuthLoading(false);
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => init());
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  };

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

  const displayName = profile?.full_name?.trim() || user?.email || "Account";

  return (
    <>
      <div className="bg-slate-100 border-b border-slate-200 text-xs py-2">
        <div className="container-academic flex justify-end items-center gap-6 text-slate-600 font-medium">
          <Link href="/about" className="hover:text-[#003262] transition-colors">About Us</Link>
          <Link href="/faculty" className="hover:text-[#003262] transition-colors">Faculty Directory</Link>
          <Link href="/events" className="hover:text-[#003262] transition-colors">Explore Events</Link>
          {!authLoading && (
            <>
              {!user ? (
                <>
                  <Link href="/login" className="hover:text-[#003262] transition-colors font-semibold">Login</Link>
                  <Link href="/signup" className="hover:text-[#003262] transition-colors font-semibold">Sign Up</Link>
                </>
              ) : (
                <>
                  <span className="text-slate-700 truncate max-w-[180px]" title={user.email ?? undefined}>
                    {displayName}
                  </span>
                  <Link href="/dashboard" className="hover:text-[#003262] transition-colors font-semibold">Dashboard</Link>
                  <button type="button" onClick={handleLogout} className="hover:text-[#003262] transition-colors font-semibold bg-transparent border-none cursor-pointer p-0">
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container-academic flex h-20 items-center justify-between">
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

          {variant === "home" && onTabChange ? (
            <nav className="hidden md:flex gap-8">
              <button
                type="button"
                onClick={() => onTabChange("research")}
                className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${activeTab === "research" ? "border-[#FDB515] text-[#003262]" : "border-transparent text-slate-500 hover:text-[#003262]"}`}
              >
                Research Opportunities
              </button>
              <button
                type="button"
                onClick={() => onTabChange("acm")}
                className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${activeTab === "acm" ? "border-[#FDB515] text-[#003262]" : "border-transparent text-slate-500 hover:text-[#003262]"}`}
              >
                ACM Activities
              </button>
              <button
                type="button"
                onClick={() => onTabChange("events")}
                className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${activeTab === "events" ? "border-[#FDB515] text-[#003262]" : "border-transparent text-slate-500 hover:text-[#003262]"}`}
              >
                Events
              </button>
            </nav>
          ) : (
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${isActive(link.href) ? "border-[#FDB515] text-[#003262]" : "border-transparent text-slate-500 hover:text-[#003262]"}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
