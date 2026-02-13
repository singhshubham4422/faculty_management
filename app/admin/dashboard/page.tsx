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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 border-t-4 border-[#FDB515]">

      {/* AUTH HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="container-academic flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#003262] text-white font-serif font-bold text-lg rounded-sm shadow-sm">S</div>
            <h1 className="text-lg font-bold tracking-tight text-[#003262] font-serif">SRM ACM SIGAPP | Faculty Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="container-academic py-10 space-y-12">

        {/* POST EDITOR */}
        <section className="bg-white p-6 md:p-8 rounded-sm border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-[#003262] font-serif mb-6 flex items-center gap-2">
            {editingPostId ? "Edit Opportunity" : "Create New Opportunity"}
            {editingPostId && (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-sm uppercase tracking-wide">Editing ID: {editingPostId}</span>
            )}
          </h2>
          <form onSubmit={savePost} className="max-w-3xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#003262]">Project Title</label>
                <input
                  className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#003262] focus:ring-1 focus:ring-[#003262]"
                  placeholder="e.g. AI for Healthcare Research"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#003262]">Category</label>
                <select
                  className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#003262] focus:ring-1 focus:ring-[#003262] bg-white"
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
              <label className="text-sm font-semibold text-[#003262]">Description</label>
              <textarea
                className="w-full h-32 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#003262] focus:ring-1 focus:ring-[#003262] resize-y"
                placeholder="Describe the opportunity, requirements, and eligibility..."
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                disabled={saving}
                type="submit"
                className="rounded-sm bg-[#003262] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#002244] disabled:opacity-50 transition-all border border-transparent"
              >
                {saving ? "Saving..." : (editingPostId ? "Update Opportunity" : "Publish Opportunity")}
              </button>
              {editingPostId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* MANAGE POSTS */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#003262] font-serif uppercase tracking-wide">Active Postings</h2>
              <span className="text-xs font-bold text-[#003262] bg-[#FDB515] px-2 py-0.5 rounded-sm">{posts.length}</span>
            </div>

            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              {loadingPosts ? (
                <div className="p-6 text-center text-sm text-slate-500 animate-pulse">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No active posts found.</div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {posts.map(p => (
                    <li key={p.id} className="flex items-start justify-between p-5 hover:bg-slate-50 transition-colors group">
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#003262] truncate text-base font-serif">{p.title}</p>
                          <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${p.type === "research" ? "bg-blue-50 text-blue-800 border-blue-100" : "bg-amber-50 text-amber-800 border-amber-100"
                            }`}>
                            {p.type === "research" ? "Research" : "ACM"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-1 mb-1">{p.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
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
                          className="text-xs font-bold uppercase tracking-wide text-[#003262] hover:text-[#C4820E] px-2 py-1 hover:bg-slate-100 rounded-sm"
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs font-bold uppercase tracking-wide text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded-sm"
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
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#003262] font-serif uppercase tracking-wide">Recent Applications</h2>
              <span className="text-xs font-bold text-[#003262] bg-[#FDB515] px-2 py-0.5 rounded-sm">{applications.length}</span>
            </div>

            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              {loadingApps ? (
                <div className="p-6 text-center text-sm text-slate-500 animate-pulse">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No applications received yet.</div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {applications.map(a => (
                    <li key={a.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-[#003262] text-base">{a.student_name}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Applied for: <span className="font-semibold text-[#003262]">{a.post_title}</span></p>
                      <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wide">
                        {a.email && (
                          <a href={`mailto:${a.email}`} className="text-[#003262] hover:text-[#C4820E] flex items-center gap-1 transition-colors">
                            Email
                          </a>
                        )}
                        {a.resume_url && (
                          <a href={a.resume_url} target="_blank" rel="noopener noreferrer" className="text-[#003262] hover:text-[#C4820E] flex items-center gap-1 transition-colors">
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
