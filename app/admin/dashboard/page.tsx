"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ================= TYPES ================= */

type Application = {
  id: string;
  student_name: string | null;
  email: string | null;
  mobile: string | null;
  resume_url: string | null;
  created_at: string;
  post_title: string;
  post_type: string;
};

type Post = {
  id: string;
  title: string | null;
  description: string | null;
  type: "research" | "club";
  created_at: string;
};

/* ================= PAGE ================= */

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [errorApps, setErrorApps] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"research" | "club" | "">("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    const ok = localStorage.getItem("isAdmin");
    if (ok !== "true") {
      router.push("/admin");
      return;
    }
    setChecking(false);
    loadPosts();
    loadApplications();
  }, [router]);

  /* ================= DATA ================= */

  const loadPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setErrorPosts(error.message);
    else setPosts(data || []);
    setLoadingPosts(false);
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        id,
        student_name,
        email,
        mobile,
        resume_url,
        created_at,
        posts(title,type)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      setErrorApps(error.message);
    } else {
      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        student_name: row.student_name,
        email: row.email,
        mobile: row.mobile,
        resume_url: row.resume_url,
        created_at: row.created_at,
        post_title: row.posts?.title ?? "",
        post_type: row.posts?.type ?? "",
      }));
      setApplications(mapped);
    }
    setLoadingApps(false);
  };

  /* ================= POSTS ================= */

  const savePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formType) return;

    setSaving(true);

    const payload = {
      title: formTitle,
      description: formDescription,
      type: formType,
    };

    const res = editingPostId
      ? await supabase.from("posts").update(payload).eq("id", editingPostId)
      : await supabase.from("posts").insert(payload);

    if (!res.error) {
      // clear form
      setFormTitle("");
      setFormDescription("");
      setFormType("");
      setEditingPostId(null);
      loadPosts();
    }

    setSaving(false);
  };

  const cancelEdit = () => {
    setFormTitle("");
    setFormDescription("");
    setFormType("");
    setEditingPostId(null);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin");
  };

  if (checking) return <div className="flex h-screen items-center justify-center text-slate-500">Verifying access...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 border-t-4 border-indigo-900">

      {/* AUTH HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="container-academic flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-indigo-900 text-white font-serif font-bold text-lg rounded-sm">S</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SRM ACM SIGAPP | Faculty Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-slate-500 hover:text-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="container-academic py-10 space-y-12">

        {/* POST EDITOR */}
        <section className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            {editingPostId ? "Edit Opportunity" : "Create New Opportunity"}
            {editingPostId && (
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Editing ID: {editingPostId}</span>
            )}
          </h2>
          <form onSubmit={savePost} className="max-w-3xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Project Title</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. AI for Healthcare Research"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                  value={formType}
                  onChange={e => setFormType(e.target.value as any)}
                  required
                >
                  <option value="">Select a category...</option>
                  <option value="research">Research Opportunity</option>
                  <option value="club">ACM Activity</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="w-full h-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                placeholder="Describe the opportunity, requirements, and eligibility..."
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={saving}
                type="submit"
                className="rounded-md bg-indigo-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 disabled:opacity-50 transition-all"
              >
                {saving ? "Saving..." : (editingPostId ? "Update Opportunity" : "Publish Opportunity")}
              </button>
              {editingPostId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* MANAGE POSTS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Active Postings</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{posts.length}</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {loadingPosts ? (
                <div className="p-6 text-center text-sm text-slate-500 animate-pulse">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No active posts found.</div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {posts.map(p => (
                    <li key={p.id} className="flex items-start justify-between p-4 hover:bg-slate-50 transition-colors group">
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${p.type === "research" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                            {p.type === "research" ? "Research" : "ACM"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{p.description}</p>
                        <p className="mt-1 text-[10px] text-slate-400">ID: {p.id}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingPostId(p.id);
                            setFormTitle(p.title ?? "");
                            setFormDescription(p.description ?? "");
                            setFormType(p.type);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-900 px-2 py-1 hover:bg-indigo-50 rounded"
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs font-medium text-red-600 hover:text-red-900 px-2 py-1 hover:bg-red-50 rounded"
                          onClick={() => deletePost(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* VIEW APPLICATIONS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{applications.length}</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {loadingApps ? (
                <div className="p-6 text-center text-sm text-slate-500 animate-pulse">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No applications received yet.</div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {applications.map(a => (
                    <li key={a.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-slate-900">{a.student_name}</p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Applied for: <span className="font-medium text-slate-700">{a.post_title}</span></p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {a.email && (
                          <a href={`mailto:${a.email}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                            Email
                          </a>
                        )}
                        {a.resume_url && (
                          <a href={a.resume_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                            View Resume →
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
