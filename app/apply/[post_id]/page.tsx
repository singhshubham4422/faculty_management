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
                  Student Name
                </label>
                <input
                  id="studentName"
                  placeholder="e.g. John Doe"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Institutional Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. john@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    placeholder="e.g. +91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-slate-700"
                >
                  Curriculum Vitae / Resume
                </label>
                <div className="rounded-md border border-slate-300 bg-slate-50 px-4 py-3">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={onFileChange}
                    required
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    PDF only, up to 2MB. 1-page resume preferred.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {formError && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}
                {success && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Application submitted successfully. We will review your candidacy and contact you shortly.
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-md bg-indigo-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Candidacy"}
                </button>
                <p className="mt-4 text-center text-xs text-slate-500">
                  By submitting, you declare that all provided information is accurate.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
