import Badge from "./Badge";

interface EventCardProps {
    title: string;
    type: string;
    status: "Upcoming" | "Past";
    date: string;
    description: string;
}

export default function EventCard({ title, type, status, date, description }: EventCardProps) {
    return (
        <div className="flex gap-6 group">
            {/* Timeline / Decorator */}
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${status === "Upcoming" ? "bg-[#FDB515] border-[#FDB515]" : "bg-slate-300 border-slate-300"
                    }`}></div>
                <div className="w-px h-full bg-slate-200 my-2 group-last:hidden"></div>
            </div>

            {/* Content */}
            <div className="pb-12 max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <Badge label={status} variant={status === "Upcoming" ? "gold" : "slate"} />
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{type}</span>
                    <span className="text-xs font-medium text-slate-400">• {date}</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#003262] mb-3 group-hover:text-[#C4820E] transition-colors">
                    {title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
