"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string | null;
  description: string | null;
  type: "research" | "club";
};

type TabType = "research" | "acm";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("research");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error(error);
        setError("Unable to load opportunities. Please try again later.");
      } else {
        setPosts((data ?? []) as Post[]);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const researchPosts = posts.filter((p) => p.type === "research");
  const clubPosts = posts.filter((p) => p.type === "club");
  const tabPosts = activeTab === "research" ? researchPosts : clubPosts;

  // VISUAL ONLY - Mock filters for Research Tab
  const RESEARCH_DOMAINS = ["AI / ML", "Systems", "Cybersecurity", "Data Science", "HCI", "Open to All"];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">

      {/* 1. UTILITY BAR (Top Thin Bar) */}
      <div className="bg-slate-100 border-b border-slate-200 text-xs py-2">
        <div className="container-academic flex justify-end gap-6 text-slate-600 font-medium">
          <a href="#" className="hover:text-[#003262] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#003262] transition-colors">Faculty Directory</a>
          <a href="#" className="hover:text-[#003262] transition-colors">Explore Events</a>
        </div>
      </div>

      {/* 2. MAIN NAVIGATIONAL HEADER */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container-academic flex h-20 items-center justify-between">

          {/* BRANDING */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[#003262] text-white font-serif font-bold text-2xl rounded-sm shadow-md">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#003262] font-serif leading-none">
                SRM ACM SIGAPP
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">
                Excellence in Computing
              </span>
            </div>
          </div>

          {/* PRIMARY NAVIGATION (Tabs relocated here) */}
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => setActiveTab("research")}
              className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${activeTab === "research"
                ? "border-[#FDB515] text-[#003262]"
                : "border-transparent text-slate-500 hover:text-[#003262]"
                }`}
            >
              Research Opportunities
            </button>
            <button
              onClick={() => setActiveTab("acm")}
              className={`text-sm font-bold uppercase tracking-wide transition-colors py-2 border-b-2 ${activeTab === "acm"
                ? "border-[#FDB515] text-[#003262]"
                : "border-transparent text-slate-500 hover:text-[#003262]"
                }`}
            >
              ACM Activities
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">

        {/* 3. HERO SECTION (Light Theme - Berkeley Style) */}
        <section className="relative bg-[#F8F9FA] py-20 border-b border-slate-200 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#003262 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="container-academic relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#003262] mb-6 tracking-tight font-serif leading-tight">
              Connecting Minds, <br />
              <span className="text-slate-800">Creating Solutions.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Advancing the frontiers of computer science through student-faculty collaboration and professional development.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab("research")}
                className="btn-primary rounded-sm shadow-md hover:shadow-lg uppercase tracking-wider text-sm"
              >
                Explore Research
              </button>
              <button
                onClick={() => setActiveTab("acm")}
                className="px-6 py-3 bg-white border border-slate-300 text-[#003262] font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-slate-50 transition-colors"
              >
                View Activities
              </button>
            </div>
          </div>
        </section>

        {/* 4. DOMAINS GRID & CONTENT */}
        <section className="py-16 bg-white">
          <div className="container-academic">

            {/* DOMAINS GRID - Only show on Research Tab */}
            {activeTab === "research" && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#003262]">Technical Domains</h2>
                  <div className="h-px bg-slate-200 flex-grow ml-6"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {RESEARCH_DOMAINS.map((domain) => (
                    <div
                      key={domain}
                      className="group p-6 border border-slate-200 bg-[#F8F9FA] hover:bg-white hover:border-[#003262] hover:shadow-md transition-all cursor-pointer text-center rounded-sm"
                    >
                      <div className="h-1 w-8 bg-[#FDB515] mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#003262] block">
                        {domain}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LISTINGS SECTION */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#003262]">
                {activeTab === "research" ? "Open Positions" : "Upcoming Activities"}
              </h2>
              <div className="h-px bg-slate-200 flex-grow ml-6"></div>
            </div>

            {loading && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-sm" />
                ))}
              </div>
            )}

            {error && (
              <div className="p-6 border-l-4 border-red-500 bg-red-50 text-red-800 rounded-r-sm">
                <p className="font-bold">System Error</p>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && tabPosts.length === 0 && (
              <div className="py-24 text-center bg-slate-50 border border-slate-200 rounded-sm">
                <div className="inline-block p-4 rounded-full bg-slate-100 mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#003262]">No Listings Found</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                  There are currently no {activeTab === "research" ? "open research positions" : "activities"} listed. Please check back later.
                </p>
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tabPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col bg-white border border-slate-200 rounded-sm transition-all hover:border-[#003262] hover:shadow-lg relative overflow-hidden"
                >
                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003262] to-[#003262] bg-[length:0%_100%] bg-no-repeat group-hover:bg-[length:100%_100%] transition-all duration-300"></div>

                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        {post.type === "research" ? "Research" : "Activity"}
                      </span>
                      {/* Featured Badge Implementation */}
                      {post.title?.includes("Security") && (
                        <span className="px-2 py-1 bg-[#FDB515] text-[#003262] text-[10px] font-bold uppercase tracking-wide rounded-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#003262] mb-3 group-hover:text-[#C4820E] transition-colors leading-tight font-serif">
                      {post.title ?? "Untitled Opportunity"}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.description ?? "No description provided."}
                    </p>
                  </div>

                  <div className="px-8 pb-8 pt-0 mt-auto">
                    <Link
                      href={`/apply/${post.id}`}
                      className="inline-flex items-center text-sm font-bold text-[#003262] hover:text-[#C4820E] uppercase tracking-wide transition-colors group-hover:underline decoration-2 underline-offset-4"
                    >
                      View Details
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 5. MOTTO SECTION (Visual Break) */}
        <section className="bg-[#003262] text-white py-24 text-center">
          <div className="container-academic">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase mb-4 text-[#FDB515]">
              Code. Connect. Conquer.
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light">
              Empowering the next generation of computing professionals through research, innovation, and community.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-sm text-slate-500">
        <div className="container-academic flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-[#003262] mb-1">SRM ACM SIGAPP Student Chapter</p>
            <p>© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#003262]">Privacy Policy</a>
            <a href="#" className="hover:text-[#003262]">Terms of Service</a>
            <a href="#" className="hover:text-[#003262]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
