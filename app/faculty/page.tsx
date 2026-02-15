import Section from "@/components/Section";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";

type FacultyMember = {
    name: string;
    title: string;
    image?: string;
    link?: string;
    isFeatured?: boolean;
};

export default function FacultyPage() {
    const FACULTY_MEMBERS: FacultyMember[] = [];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
            <Header />

            <section className="bg-white border-b border-slate-200 py-16 text-center">
                <div className="container-academic">
                    <h1 className="text-4xl text-[#003262] font-serif font-bold mb-4">Academic Leadership</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Guided by distinguished faculty members committed to excellence in research and student development.
                    </p>
                </div>
            </section>

            <Section>
                {/* FEATURED PROFILE */}
                <div className="mb-20 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                    <ProfileCard
                        name="Dr. Vaishnavi Moorthy"
                        title="Faculty Advisor / Professor, SRMIST"
                        link="https://www.srmist.edu.in/faculty/vaishnavi-moorthy/"
                        isFeatured={true}
                    />
                </div>

                {/* PROFILE GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FACULTY_MEMBERS.map((faculty, idx) => (
                        <ProfileCard
                            key={idx}
                            name={faculty.name}
                            title={faculty.title}
                            isFeatured={faculty.isFeatured}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}
