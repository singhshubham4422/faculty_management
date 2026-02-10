"use client";

import Link from "next/link";
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

  // VISUAL ONLY - Mock filters for Research Tab (No backend logic)
  const RESEARCH_DOMAINS = ["AI / ML", "Systems", "Cybersecurity", "Data Science", "HCI", "Open to All"];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* 1. MINIMAL ACADEMIC HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container-academic flex h-20 items-center">
          <div className="flex items-center gap-3">
            {/* Simple Academic Logo Placeholder */}
            <div className="flex h-10 w-10 items-center justify-center bg-indigo-900 text-white font-serif font-bold text-xl rounded-sm">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                SRM ACM SIGAPP
              </span>
              <span className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Academic & Professional Opportunities
              </span>
            </div>
          </div>
          {/* Right side intentionally left empty as per strict guidelines */}
        </div>
      </header>

      {/* 2. TOP-LEVEL PAGE CONTROLLER TABS */}
      <nav className="border-b border-slate-100 bg-slate-50/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="container-academic flex gap-8">
          <button
            onClick={() => setActiveTab("research")}
            className={`py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "research"
                ? "border-indigo-900 text-indigo-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            Research Opportunities
          </button>
          <button
            onClick={() => setActiveTab("acm")}
            className={`py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "acm"
                ? "border-indigo-900 text-indigo-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            ACM Activities
          </button>
        </div>
      </nav>

      <main className="container-academic py-12 min-h-[600px]">

        {/* 3. DYNAMIC CONTENT AREA BASED ON TAB */}

        {/* HEADER SECTION */}
        <div className="mb-10 max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {activeTab === "research" ? "Research Opportunities" : "ACM Professional Activities"}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            {activeTab === "research"
              ? "Faculty-curated research positions across academic domains. Collaborate on cutting-edge projects."
              : "SIG initiatives, workshops, hackathons, and student-led professional development programs."
            }
          </p>

          {/* Research Filters (Visual Only) */}
          {activeTab === "research" && (
            <div className="mt-6 flex flex-wrap gap-2">
              {RESEARCH_DOMAINS.map((domain) => (
                <span key={domain} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600 cursor-default">
                  {domain}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LISTINGS GRID */}
        <div>
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded bg-slate-50 border border-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          {!loading && !error && tabPosts.length === 0 && (
            <div className="py-24 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-900 font-medium">No active listings</p>
              <p className="text-slate-500 text-sm mt-1">Check back later for new {activeTab === "research" ? "research positions" : "events"}.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col justify-between bg-white border border-slate-200 p-6 rounded-lg transition-all hover:border-indigo-300 hover:shadow-sm"
                >
                  <div>
                    {/* METADATA ROW */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase border border-slate-200 px-2 py-0.5 rounded-sm">
                        {post.type === "research" ? "Research Domain" : "SIG Activity"}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wide border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {post.type === "research" ? "Applications Open" : "Registration Open"}
                      </span>
                    </div>

                    {/* TITLE & DESC */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-900 leading-tight">
                      {post.title ?? "Untitled Opportunity"}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                      {post.description ?? "No description provided."}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="pt-5 border-t border-slate-100">
                    <Link
                      href={`/apply/${post.id}`}
                      className="inline-flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                    >
                      View Details
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="container-academic text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SRM ACM SIGAPP. All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <span className="mx-2">Privacy</span>
            <span className="mx-2">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
