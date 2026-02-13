interface DomainCardProps {
    title: string;
    items: string[];
    icon?: string; // Simple string identifier for icon logic if needed, or stick to text for now
    variant?: "tech" | "non-tech";
}

export default function DomainCard({ title, items, variant = "tech" }: DomainCardProps) {
    return (
        <div className="group h-full p-8 border border-slate-200 bg-white hover:border-[#FDB515] transition-all hover:shadow-sm flex flex-col rounded-sm">
            <div className="mb-4">
                <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 ${variant === "tech" ? "bg-blue-50 text-blue-800" : "bg-emerald-50 text-emerald-800"
                    }`}>
                    {variant === "tech" ? "Technical Domain" : "Non-Technical"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#003262] group-hover:text-[#C4820E] transition-colors">
                    {title}
                </h3>
            </div>

            <ul className="mt-auto space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2 group-hover:bg-[#FDB515] transition-colors"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
