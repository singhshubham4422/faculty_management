"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Post = {
  id: string;
  title: string | null;
  description: string | null;
  type: "research" | "club";
};

export default function ApplyPage() {
  const { post_id } = useParams<{ post_id: string }>();
  const postId = post_id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= Fetch Post ================= */
  useEffect(() => {
    const loadPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        setFormError("Post not found");
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    loadPost();
  }, [post_id]);

  /* ================= File Validation ================= */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" || file.size > 2 * 1024 * 1024) {
      setFormError("Resume must be a PDF under 2MB");
      return;
    }
    setResumeFile(file);
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!resumeFile) {
      setFormError("Resume required");
      return;
    }

    setSubmitting(true);

    try {
      const path = `resumes/${postId}-${crypto.randomUUID()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, resumeFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(path);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to generate resume URL.");
      }

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          student_name: studentName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          resume_url: urlData.publicUrl,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setFormError(json.error || "Submission failed");
        return;
      }

      setFormError(null);
      setSuccess(true);
      setStudentName("");
      setEmail("");
      setMobile("");
      setResumeFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Application submit failed:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Failed to submit application.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  if (loading)
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm text-slate-600">Loading…</p>
          </div>
        </div>
      </main>
    );
  if (formError && !post) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-red-700">{formError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Student application
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Apply for: {post?.title}
              </h1>
              {post?.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {post.description}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">
                  Fill out the form below. We’ll review your application and get
                  back to you.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Student name
                </label>
                <input
                  id="studentName"
                  placeholder="e.g., Ayesha Khan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g., ayesha@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    placeholder="e.g., 0300 1234567"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-slate-700"
                >
                  Resume (PDF)
                </label>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={onFileChange}
                    required
                    className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 file:shadow-sm file:ring-1 file:ring-slate-200 hover:file:bg-slate-50"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    PDF only, up to 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Application submitted!
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Double-check your details before submitting.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
