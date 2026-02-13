import Section from "@/components/Section";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
    const EVENTS = [
        {
            title: "Advanced React & Next.js Workshop",
            type: "Workshop",
            status: "Upcoming" as const,
            date: "March 15, 2026",
            description: "A comprehensive deep dive into server components, routing, and state management in modern web development.",
        },
        {
            title: "Global Innovation Challenge 2026",
            type: "Hackathon",
            status: "Upcoming" as const,
            date: "April 02, 2026",
            description: "Solve real-world problems with code. Categories include FinTech, Healthcare, and Sustainable Energy.",
        },
        {
            title: "Introduction to Generative AI",
            type: "Workshop",
            status: "Past" as const,
            date: "February 10, 2026",
            description: "Hands-on session exploring LLMs, prompt engineering, and API integration for AI-powered applications.",
        },
        {
            title: "Cybersecurity Awareness Seminar",
            type: "Seminar",
            status: "Past" as const,
            date: "January 24, 2026",
            description: "Industry experts discussed the latest threats in the digital landscape and defensive strategies.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
            <Header />

            <section className="bg-white border-b border-slate-200 py-16">
                <div className="container-academic">
                    <h1 className="text-4xl text-[#003262] font-serif font-bold mb-4">Events & Activities</h1>
                    <p className="text-slate-500">
                        Fostering learning and innovation through expertly curated workshops and challenges.
                    </p>
                </div>
            </section>

            <Section>
                <div className="max-w-4xl mx-auto space-y-2">
                    {EVENTS.map((event, idx) => (
                        <EventCard
                            key={idx}
                            {...event}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}
