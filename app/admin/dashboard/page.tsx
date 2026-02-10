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
      setFormTitle("");
      setFormDescription("");
      setFormType("");
      setEditingPostId(null);
      loadPosts();
    }

    setSaving(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin");
  };

  if (checking) return <p className="p-6">Checking access…</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <button onClick={logout} className="text-red-600">Logout</button>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Create / Edit Post</h2>
        <form onSubmit={savePost} className="space-y-3">
          <input className="border p-2 w-full" placeholder="Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
          <textarea className="border p-2 w-full" placeholder="Description" value={formDescription} onChange={e => setFormDescription(e.target.value)} />
          <select className="border p-2 w-full" value={formType} onChange={e => setFormType(e.target.value as any)}>
            <option value="">Select type</option>
            <option value="research">Research</option>
            <option value="club">ACM</option>
          </select>
          <button disabled={saving} className="bg-black text-white px-4 py-2">
            {editingPostId ? "Update" : "Create"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Posts</h2>
        {loadingPosts ? "Loading…" : posts.map(p => (
          <div key={p.id} className="border-b py-2 flex justify-between">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm">{p.type}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => {
                setEditingPostId(p.id);
                setFormTitle(p.title ?? "");
                setFormDescription(p.description ?? "");
                setFormType(p.type);
              }}>Edit</button>
              <button className="text-red-600" onClick={() => deletePost(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Applications</h2>
        {loadingApps ? "Loading…" : applications.map(a => (
          <div key={a.id} className="border-b py-2">
            <p className="font-semibold">{a.student_name}</p>
            <p className="text-sm">{a.post_title}</p>
            {a.resume_url && <a className="text-indigo-600" href={a.resume_url} target="_blank">View Resume</a>}
          </div>
        ))}
      </section>
    </div>
  );
}
