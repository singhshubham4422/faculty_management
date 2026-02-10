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
        setError("Failed to load opportunities.");
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="card-surface relative overflow-hidden rounded-3xl bg-white px-8 py-10 shadow-xl ring-1 ring-slate-200">
          <div className="absolute inset-x-10 bottom-0 h-32 rounded-t-[32px] bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-xs font-medium text-indigo-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                New opportunities are added by faculty
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Research Opportunities & ACM Activities
              </h1>
              <p className="text-base leading-relaxed text-slate-600">
                Discover faculty-led research roles and professional ACM activities. Browse by focus area and apply directly to opportunities that match your interests.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" /> Research placements
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> ACM professional growth
                </div>
              </div>
            </div>
            <div className="w-full max-w-xs self-start rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-lg">
              <p className="text-sm text-slate-200">Ready to contribute?</p>
              <p className="mt-2 text-xl font-semibold">Apply to openings curated by faculty mentors.</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-200/80">
                <div>
                  <p className="text-2xl font-semibold text-white">{posts.length || "—"}</p>
                  <p>Open postings</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{researchPosts.length || "—"}</p>
                  <p>Research roles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="opportunities" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Open roles</p>
              <h2 className="text-xl font-semibold text-slate-900">Explore and apply in a few clicks</h2>
            </div>
            <div className="flex rounded-full bg-slate-100 p-1 text-sm font-medium">
              <button
                onClick={() => setActiveTab("research")}
                className={`pill px-4 py-2 transition ${
                  activeTab === "research"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Research Opportunities
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{researchPosts.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("acm")}
                className={`pill px-4 py-2 transition ${
                  activeTab === "acm"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ACM Professional Activities
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{clubPosts.length}</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="card-surface animate-pulse rounded-2xl p-5"
                >
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="mt-3 h-5 w-3/4 rounded-full bg-slate-200" />
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-200" />
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200" />
                  <div className="mt-5 h-10 w-full rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tabPosts.length === 0 && (
                <div className="card-surface col-span-full flex flex-col items-center justify-center rounded-2xl p-10 text-center text-slate-600">
                  <div className="mb-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
                    {activeTab === "research" ? "Research" : "ACM"}
                  </div>
                  <p className="text-lg font-semibold text-slate-900">No opportunities yet</p>
                  <p className="mt-1 max-w-md text-sm text-slate-600">
                    Faculty will publish new opportunities soon. Check back or visit the other tab to see what is available.
                  </p>
                </div>
              )}

              {tabPosts.map((post) => (
                <article
                  key={post.id}
                  className="card-surface flex h-full flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        post.type === "research"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {post.type === "research" ? "Research" : "ACM Activity"}
                    </span>

                    <h3 className="text-lg font-semibold text-slate-900">
                      {post.title ?? "Untitled"}
                    </h3>

                    {post.description && (
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/apply/${post.id}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply Now
                    <span aria-hidden className="text-base">→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/80 py-6 backdrop-blur">
        <p className="text-center text-sm text-slate-500">
          Faculty Opportunities Portal · Built for students and faculty collaboration
        </p>
      </footer>
    </div>
  );
}
