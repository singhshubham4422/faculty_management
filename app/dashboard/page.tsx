"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

type Profile = {
  full_name: string | null;
  mobile: string | null;
};

type ApplicationRow = {
  id: string;
  post_id: string;
  resume_url: string | null;
  status: string;
  created_at: string;
  posts: { title: string | null; type: string } | { title: string | null; type: string }[] | null;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        router.replace("/login?redirect=/dashboard");
        return;
      }
      setUser(u);
      const { data: p } = await supabase.from("profiles").select("full_name, mobile").eq("id", u.id).single();
      setProfile(p ?? null);
      const { data: apps, error: err } = await supabase
        .from("applications")
        .select(`
          id,
          post_id,
          resume_url,
          status,
          created_at,
          posts(title, type)
        `)
        .eq("student_id", u.id)
        .order("created_at", { ascending: false });
      if (err) setError(err.message);
      else setApplications((apps ?? []) as unknown as ApplicationRow[]);
      setLoading(false);
    };
    load();
  }, [router]);

  const startEditProfile = () => {
    setEditFullName(profile?.full_name?.trim() ?? "");
    setEditMobile(profile?.mobile?.trim() ?? "");
    setProfileError(null);
    setProfileSuccess(null);
    setEditingProfile(true);
  };

  const cancelEditProfile = () => {
    setEditingProfile(false);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const saveProfile = async () => {
    const name = editFullName.trim();
    const mobile = editMobile.trim();
    setProfileError(null);
    setProfileSuccess(null);
    if (!name) {
      setProfileError("Full name is required.");
      return;
    }
    if (!mobile) {
      setProfileError("Mobile number is required.");
      return;
    }
    if (!user) return;
    setSaving(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: name, mobile })
      .eq("id", user.id);
    setSaving(false);
    if (updateError) {
      setProfileError(updateError.message);
      return;
    }
    setProfile({ full_name: name, mobile });
    setProfileSuccess("Profile updated successfully.");
    setEditingProfile(false);
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center p-6">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-grow p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-slate-900">My Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Your profile and applications.</p>

          <div className="mt-6 rounded border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Profile</h2>
              {!editingProfile && (
                <button
                  type="button"
                  onClick={startEditProfile}
                  className="text-sm font-bold uppercase tracking-wide text-[#003262] hover:text-[#C4820E] transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            {profileError && (
              <p className="text-sm text-red-600 mb-4" role="alert">{profileError}</p>
            )}
            {profileSuccess && (
              <p className="text-sm text-green-700 mb-4" role="status">{profileSuccess}</p>
            )}
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-full-name" className="block text-sm text-slate-500 mb-1">Full name</label>
                  <input
                    id="edit-full-name"
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#003262] focus:ring-1 focus:ring-[#003262]"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Email</label>
                  <p className="text-sm font-medium text-slate-900">{user.email || "—"}</p>
                </div>
                <div>
                  <label htmlFor="edit-mobile" className="block text-sm text-slate-500 mb-1">Mobile</label>
                  <input
                    id="edit-mobile"
                    type="tel"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#003262] focus:ring-1 focus:ring-[#003262]"
                    placeholder="Your mobile number"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="rounded bg-[#003262] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#002244] disabled:opacity-50 transition-colors"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditProfile}
                    disabled={saving}
                    className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-500">Full name</dt>
                  <dd className="font-medium text-slate-900">{profile?.full_name?.trim() || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-medium text-slate-900">{user.email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Mobile</dt>
                  <dd className="font-medium text-slate-900">{profile?.mobile?.trim() || "—"}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">My Applications</h2>
              <Link href="/" className="text-sm font-medium text-[#003262] hover:underline">
                Browse opportunities
              </Link>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!error && applications.length === 0 && (
              <p className="text-sm text-slate-500 py-4">You have not submitted any applications yet.</p>
            )}
            {!error && applications.length > 0 && (
              <ul className="space-y-4">
                {applications.map((a) => (
                  <li key={a.id} className="rounded border border-slate-200 bg-white p-4">
                    <p className="font-medium text-slate-900">
                      {(Array.isArray(a.posts) ? a.posts[0] : a.posts)?.title ?? "Application"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${statusBadgeClass(a.status)}`}
                      >
                        {a.status}
                      </span>
                    </div>
                    {a.resume_url && (
                      <a
                        href={a.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-[#003262] hover:underline"
                      >
                        View resume
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
