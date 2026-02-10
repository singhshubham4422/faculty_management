"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

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
  const [isChecking, setIsChecking] = useState(true);

  const [applications, setApplications] = useState<Application[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"research" | "club" | "">("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin");
      return;
    }

    setIsChecking(false);
    fetchApplications();
    fetchPosts();
  }, [router]);

  /* ================= APPLICATIONS ================= */

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/applications");
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load applications.");
        return;
      }

      setApplications(json.applications || []);
    } catch {
      setError("Network error while loading applications.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= POSTS ================= */

  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);

    try {
      const res = await fetch("/api/admin/posts");
      const json = await res.json();

      if (!res.ok) {
        setPostsError(json.error || "Failed to load posts.");
        return;
      }

      setPosts(json.posts || []);
    } catch {
      setPostsError("Network error while loading posts.");
    } finally {
      setPostsLoading(false);
    }
  };

  /* ================= POST FORM ================= */

  const handlePostSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setPostsError(null);

    if (!formTitle || !formDescription || !formType) {
      setPostsError("All fields are required.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/posts", {
        method: editingPostId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPostId,
          title: formTitle,
          description: formDescription,
          type: formType,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setPostsError(json.error || "Failed to save post.");
        return;
      }

      setFormTitle("");
      setFormDescription("");
      setFormType("");
      setEditingPostId(null);
      fetchPosts();
    } catch {
      setPostsError("Network error while saving post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;

    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setPostsError("Failed to delete post.");
      }
    } catch {
      setPostsError("Network error while deleting post.");
    }
  };

  const handleEditPost = (post: Post) => {
    setFormTitle(post.title || "");
    setFormDescription(post.description || "");
    setFormType(post.type);
    setEditingPostId(post.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin");
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  /* ================= UI ================= */

  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Manage posts & applications</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-red-600">
            Logout
          </button>
        </header>

        {/* POSTS */}
        <section className="mb-10 rounded-xl bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Posts</h2>

          <form onSubmit={handlePostSubmit} className="mb-6 space-y-3">
            <input
              placeholder="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded border p-2"
            />
            <textarea
              placeholder="Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full rounded border p-2"
            />
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="w-full rounded border p-2"
            >
              <option value="">Select type</option>
              <option value="research">Research</option>
              <option value="club">ACM</option>
            </select>
            <button className="rounded bg-black px-4 py-2 text-white">
              {editingPostId ? "Update" : "Create"}
            </button>
          </form>

          {postsLoading ? (
            <p>Loading posts…</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="mb-3 flex justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(p.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditPost(p)}>Edit</button>
                  <button onClick={() => handleDeletePost(p.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* APPLICATIONS */}
        <section className="rounded-xl bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Applications</h2>

          {loading ? (
            <p>Loading applications…</p>
          ) : (
            applications.map((a) => (
              <div key={a.id} className="border-b py-3">
                <p className="font-semibold">{a.student_name}</p>
                <p className="text-sm">{a.post_title}</p>
                {a.resume_url && (
                  <a href={a.resume_url} target="_blank" className="text-indigo-600">
                    View Resume
                  </a>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
