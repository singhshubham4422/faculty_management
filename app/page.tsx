"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string | null;
  description: string | null;
  type: "research" | "club" | "event";
  thumbnail_url: string | null;
};

type TabType = "research" | "acm" | "events";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("research");
  const listingsSectionRef = useRef<HTMLElement>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      listingsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error: fetchError } = await supabase.from("posts").select("id, title, description, type, thumbnail_url");
      if (fetchError) {
        console.error(fetchError);
        setError("Unable to load content. Please try again later.");
      } else {
        setPosts((data ?? []) as Post[]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const researchPosts = posts.filter((p) => p.type === "research");
  const clubPosts = posts.filter((p) => p.type === "club");
  const eventPosts = posts.filter((p) => p.type === "event");

  const tabPosts =
    activeTab === "research" ? researchPosts
    : activeTab === "acm" ? clubPosts
    : eventPosts;

  const RESEARCH_DOMAINS = ["AI / ML", "Systems", "Cybersecurity", "Data Science", "HCI", "Open to All"];

  const sectionTitle =
    activeTab === "research" ? "Open Positions"
    : activeTab === "acm" ? "Upcoming Activities"
    : "Events";

  const emptyMessage =
    activeTab === "research" ? "open research positions"
    : activeTab === "acm" ? "activities"
    : "events";

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <Header variant="home" activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-grow">
        <section className="relative bg-[#F8F9FA] py-20 border-b border-slate-200 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#003262 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="container-academic relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#003262] mb-6 tracking-tight font-serif leading-tight">
              Connecting Minds, <br />
              <span className="text-slate-800">Creating Solutions.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Advancing the frontiers of computer science through student-faculty collaboration and professional development.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button type="button" onClick={() => handleTabChange("research")} className="btn-primary rounded-sm shadow-md hover:shadow-lg uppercase tracking-wider text-sm">
                Explore Research
              </button>
              <button type="button" onClick={() => handleTabChange("acm")} className="px-6 py-3 bg-white border border-slate-300 text-[#003262] font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-slate-50 transition-colors">
                View Activities
              </button>
              <button type="button" onClick={() => handleTabChange("events")} className="px-6 py-3 bg-white border border-slate-300 text-[#003262] font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-slate-50 transition-colors">
                View Events
              </button>
            </div>
          </div>
        </section>

        <section ref={listingsSectionRef} className="py-16 bg-white scroll-mt-20">
          <div className="container-academic">
            <div key={activeTab} className="tab-content-fade-in">
            {activeTab === "research" && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#003262]">Technical Domains</h2>
                  <div className="h-px bg-slate-200 flex-grow ml-6" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {RESEARCH_DOMAINS.map((domain) => (
                    <div key={domain} className="group p-6 border border-slate-200 bg-[#F8F9FA] hover:bg-white hover:border-[#003262] hover:shadow-md transition-all cursor-pointer text-center rounded-sm">
                      <div className="h-1 w-8 bg-[#FDB515] mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#003262] block">{domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#003262]">{sectionTitle}</h2>
              <div className="h-px bg-slate-200 flex-grow ml-6" />
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
                <p className="font-bold">Something went wrong</p>
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
                <h3 className="text-lg font-bold text-[#003262]">Nothing here yet</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                  There are no {emptyMessage} listed right now. Check back later.
                </p>
              </div>
            )}

            {!loading && !error && activeTab !== "events" && tabPosts.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {tabPosts.map((post) => (
                  <div key={post.id} className="group flex flex-col bg-white border border-slate-200 rounded-sm transition-all hover:border-[#003262] hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#003262] bg-[length:0%_100%] bg-no-repeat group-hover:bg-[length:100%_100%] transition-all duration-300" />
                    <div className="p-8 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                          {post.type === "research" ? "Research" : "Activity"}
                        </span>
                        {post.title?.includes("Security") && (
                          <span className="px-2 py-1 bg-[#FDB515] text-[#003262] text-[10px] font-bold uppercase tracking-wide rounded-sm">Featured</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#003262] mb-3 group-hover:text-[#C4820E] transition-colors leading-tight font-serif">
                        {post.title ?? "Untitled"}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{post.description ?? "No description provided."}</p>
                    </div>
                    <div className="px-8 pb-8 pt-0 mt-auto">
                      <Link href={`/apply/${post.id}`} className="inline-flex items-center text-sm font-bold text-[#003262] hover:text-[#C4820E] uppercase tracking-wide transition-colors group-hover:underline decoration-2 underline-offset-4">
                        View Details
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && activeTab === "events" && tabPosts.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {tabPosts.map((post) => (
                  <div key={post.id} className="group flex flex-col bg-white border border-slate-200 rounded-sm transition-all hover:border-[#003262] hover:shadow-lg overflow-hidden">
                    <div className="aspect-video bg-slate-100 relative">
                      {post.thumbnail_url ? (
                        <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Event</span>
                      <h3 className="text-xl font-bold text-[#003262] mb-2 group-hover:text-[#C4820E] transition-colors leading-tight font-serif">
                        {post.title ?? "Untitled Event"}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">{post.description ?? "No description provided."}</p>
                      <Link href={`/apply/${post.id}`} className="inline-flex items-center text-sm font-bold text-[#003262] hover:text-[#C4820E] uppercase tracking-wide transition-colors group-hover:underline decoration-2 underline-offset-4">
                        View Details
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </section>

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
            <Link href="/about" className="hover:text-[#003262]">About</Link>
            <Link href="/faculty" className="hover:text-[#003262]">Faculty</Link>
            <Link href="/events" className="hover:text-[#003262]">Events</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
