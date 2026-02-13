import Section from "@/components/Section";
import Header from "@/components/Header";
import DomainCard from "@/components/DomainCard";

export default function AboutPage() {
    const TECHNICAL_DOMAINS = [
        { title: "R&D", items: ["Artificial Intelligence", "Blockchain", "Cloud Computing"] },
        { title: "Web/App", items: ["Full Stack Development", "Mobile Applications", "UI/UX Design"] },
        { title: "Extended Reality", items: ["AR/VR Development", "Game Design", "3D Modeling"] },
        { title: "Gen-AI", items: ["LLM Applications", "Prompt Engineering", "Generative Art"] },
    ];

    const NON_TECHNICAL_DOMAINS = [
        { title: "Management", items: ["Event Planning", "Logistics", "Team Coordination"] },
        { title: "Creatives", items: ["Graphic Design", "Video Editing", "Content Creation"] },
        { title: "Corporate", items: ["Sponsorships", "Public Relations", "Outreach"] },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
            <Header />

            {/* 1. HERO SECTION */}
            <section className="bg-[#003262] text-white py-24 md:py-32 relative overflow-hidden">
                <div className="container-academic relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">
                        Code. Connect. Conquer.
                    </h1>
                    <div className="w-24 h-1.5 bg-[#FDB515] mx-auto rounded-full mb-8"></div>
                    <p className="max-w-3xl mx-auto text-xl text-slate-300 font-light leading-relaxed">
                        We are the student chapter of the Association for Computing Machinery (ACM) Special Interest Group on Applied Computing (SIGAPP) at SRM Institute of Science and Technology.
                    </p>
                </div>
            </section>

            {/* 2. MISSION & VISION GRID */}
            <Section className="bg-white">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Mission */}
                    <div className="p-8 border-l-4 border-[#003262] bg-slate-50 rounded-r-sm">
                        <h2 className="text-2xl font-serif font-bold text-[#003262] mb-4">Our Mission</h2>
                        <p className="text-slate-700 leading-relaxed">
                            To empower students with technical expertise, foster a strong professional network, and bridge the gap between academia and industry through practical application and research.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="p-8 border-l-4 border-[#FDB515] bg-slate-50 rounded-r-sm">
                        <h2 className="text-2xl font-serif font-bold text-[#003262] mb-4">Our Vision</h2>
                        <p className="text-slate-700 leading-relaxed">
                            To become the most dynamic, future-driven student technical community at SRMIST, recognized for innovation, research excellence, and professional development.
                        </p>
                    </div>
                </div>
            </Section>

            {/* 3. DOMAIN BENTO GRID */}
            <Section className="bg-[#F8F9FA]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-[#003262]">Our Domains</h2>
                    <p className="text-slate-500 mt-2">Structured expertise across technical and management fields.</p>
                </div>

                <div className="space-y-16">
                    {/* Technical Grid */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Technical</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {TECHNICAL_DOMAINS.map((domain) => (
                                <DomainCard key={domain.title} title={domain.title} items={domain.items} variant="tech" />
                            ))}
                        </div>
                    </div>

                    {/* Non-Technical Grid */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Non-Technical</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {NON_TECHNICAL_DOMAINS.map((domain) => (
                                <DomainCard key={domain.title} title={domain.title} items={domain.items} variant="non-tech" />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
