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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Research Opportunities & ACM Activities
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-slate-600">
            Discover faculty-led research and professional activities. Apply directly with ease.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8 flex-1">
        {/* Tabs */}
        <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("research")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === "research"
                ? "bg-white shadow text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Research Opportunities
          </button>
          <button
            onClick={() => setActiveTab("acm")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === "acm"
                ? "bg-white shadow text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ACM Professional Activities
          </button>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-slate-600">Loading opportunities…</p>
        )}

        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(activeTab === "research" ? researchPosts : clubPosts).map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition"
              >
                <span className="text-xs font-medium text-slate-500 uppercase">
                  {post.type === "research" ? "Research" : "ACM Activity"}
                </span>

                <h3 className="mt-2 text-base font-semibold text-slate-900">
                  {post.title ?? "Untitled"}
                </h3>

                {post.description && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {post.description}
                  </p>
                )}

                <Link
                  href={`/apply/${post.id}`}
                  className="mt-4 inline-flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Apply Now
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          Faculty Opportunities Portal
        </p>
      </footer>
    </div>
  );
}
