import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers | Faculty Opportunities Portal",
  description: "Meet the developers behind the Faculty Opportunities Portal.",
};

export default function DevelopersPage() {
  return (
    <>
      <Header />
      <main className="container-academic py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003262] mb-4">Meet the Developers</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The team behind the design and development of the SRM ACM SIGAPP Student Chapter platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Developer 1 */}
            <div className="bg-white rounded-none shadow-sm border border-slate-200 p-8 text-center transition-all hover:shadow-md hover:border-[#FDB515]">
              <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 border border-slate-200 overflow-hidden">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#003262] mb-1">Developer One</h2>
              <p className="text-xs text-[#FDB515] font-bold uppercase tracking-widest mb-6">Lead Developer</p>
              
              <div className="flex flex-col gap-3 mt-6 border-t border-slate-100 pt-6">
                <a 
                  href="mailto:developer1@example.com" 
                  className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-[#003262] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>developer1@example.com</span>
                </a>
                <a 
                  href="https://linkedin.com/in/developer1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-[#0077b5] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="bg-white rounded-none shadow-sm border border-slate-200 p-8 text-center transition-all hover:shadow-md hover:border-[#FDB515]">
              <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 border border-slate-200 overflow-hidden">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#003262] mb-1">Developer Two</h2>
              <p className="text-xs text-[#FDB515] font-bold uppercase tracking-widest mb-6">Core Developer</p>
              
              <div className="flex flex-col gap-3 mt-6 border-t border-slate-100 pt-6">
                <a 
                  href="mailto:developer2@example.com" 
                  className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-[#003262] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>developer2@example.com</span>
                </a>
                <a 
                  href="https://linkedin.com/in/developer2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-[#0077b5] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
