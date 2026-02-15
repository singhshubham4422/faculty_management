import Header from "@/components/Header";

export default function AboutPage() {
  const technicalDomains = [
    {
      title: "R & D",
      content:
        "Explore advanced technologies, research methodologies, and strategies to drive innovation in cutting-edge projects.",
    },
    {
      title: "Web/App Development",
      content:
        "Build responsive websites and mobile applications using modern frameworks, full-stack technologies, and best practices.",
    },
    {
      title: "Metaverse",
      content:
        "Create immersive virtual worlds, extended reality experiences, and interactive environments for next-gen gaming.",
    },
    {
      title: "Generative AI",
      content:
        "Leverage large language models, creative AI tools, and prompt engineering to generate innovative content and solutions.",
    },
  ];

  const nonTechnicalDomains = [
    {
      title: "Management",
      content:
        "Develop leadership, strategy, and organizational skills to plan and execute impactful events and experiences.",
    },
    {
      title: "Creatives",
      content:
        "Master design thinking, content creation, and multimedia arts to craft visually compelling and innovative experiences.",
    },
    {
      title: "Corporate",
      content:
        "Understand business operations, organizational frameworks, and industry practices to drive corporate strategy and efficiency.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      <main>
        {/* Section 1 — Who We Are */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-academic max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#003262] mb-6 tracking-tight">
              Who We Are
            </h1>
            <div className="w-16 h-0.5 bg-[#FDB515] mx-auto mb-6" aria-hidden />
            <p className="text-slate-700 text-lg leading-relaxed">
              We are the student chapter of the Association for Computing Machinery (ACM) Special
              Interest Group on Applied Computing (SIGAPP) at SRM Institute of Science and Technology.
            </p>
          </div>
        </section>

        {/* Section 2 — Mission / Vision / Motto */}
        <section className="py-16 md:py-20 bg-[#F8F9FA]">
          <div className="container-academic">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <h2 className="text-xl font-serif font-bold text-[#003262] mb-3">Mission</h2>
                <div className="w-10 h-0.5 bg-[#FDB515] mb-4" aria-hidden />
                <p className="text-slate-600 leading-relaxed">
                  Empower students technically, foster a strong network, and bridge the gap between
                  academia and industry.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <h2 className="text-xl font-serif font-bold text-[#003262] mb-3">Vision</h2>
                <div className="w-10 h-0.5 bg-[#FDB515] mb-4" aria-hidden />
                <p className="text-slate-600 leading-relaxed">
                  To be the most dynamic, future-driven student tech community at SRMIST, producing
                  innovators who solve real-world problems.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <h2 className="text-xl font-serif font-bold text-[#003262] mb-3">Motto</h2>
                <div className="w-10 h-0.5 bg-[#FDB515] mb-4" aria-hidden />
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-semibold text-[#003262]">&quot;Code. Connect. Conquer.&quot;</span>
                  {" "}
                  Learn and innovate, build bridges between people and ideas, and lead change in tech.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Our Domains */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-academic">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#003262] mb-3">
                Our Domains
              </h2>
              <div className="w-16 h-0.5 bg-[#FDB515] mx-auto mb-4" aria-hidden />
              <p className="text-slate-600 text-lg leading-relaxed">
                Discover cutting-edge fields and build expertise across technical and creative domains.
              </p>
            </div>

            <div className="space-y-14">
              <div>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
                  Technical Domains
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {technicalDomains.map((domain) => (
                    <div
                      key={domain.title}
                      className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#FDB515]/30 transition-all duration-200"
                    >
                      <h4 className="text-lg font-serif font-bold text-[#003262] mb-2">
                        {domain.title}
                      </h4>
                      <div className="w-8 h-0.5 bg-[#FDB515] mb-3" aria-hidden />
                      <p className="text-slate-600 text-sm leading-relaxed">{domain.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
                  Non-Technical Domains
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nonTechnicalDomains.map((domain) => (
                    <div
                      key={domain.title}
                      className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#FDB515]/30 transition-all duration-200"
                    >
                      <h4 className="text-lg font-serif font-bold text-[#003262] mb-2">
                        {domain.title}
                      </h4>
                      <div className="w-8 h-0.5 bg-[#FDB515] mb-3" aria-hidden />
                      <p className="text-slate-600 text-sm leading-relaxed">{domain.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 — Registration Notice */}
        <section className="py-16 md:py-20 bg-[#F8F9FA]">
          <div className="container-academic max-w-2xl mx-auto">
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-6 md:p-8 text-center shadow-sm">
              <p className="text-slate-800 text-lg leading-relaxed">
                Exciting opportunities are added regularly — keep checking our website so you don’t miss out!
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 — Coming Soon */}
        <section className="py-16 md:py-20 bg-white border-t border-slate-200">
          <div className="container-academic max-w-2xl mx-auto text-center">
            <div className="pt-2 border-t border-slate-200" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#003262] mt-8 mb-4">
              Coming Soon
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Join us for an exciting challenge where teamwork and problem-solving meet adventure.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <div className="container-academic">
          <p className="font-semibold text-[#003262]">SRM ACM SIGAPP</p>
          <p className="mt-1">Excellence in Computing</p>
        </div>
      </footer>
    </div>
  );
}
