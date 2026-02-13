interface ProfileCardProps {
    name: string;
    title: string;
    image?: string; // Optional URL
    link?: string;
    isFeatured?: boolean;
}

export default function ProfileCard({ name, title, image, link, isFeatured = false }: ProfileCardProps) {
    return (
        <div className={`group border rounded-sm p-6 flex flex-col items-center text-center transition-all ${isFeatured
                ? "border-[#003262] bg-white shadow-lg scale-105 relative z-10"
                : "border-slate-200 bg-white hover:border-[#003262] hover:shadow-md"
            }`}>
            {isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDB515] text-[#003262] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                    Featured Faculty
                </div>
            )}

            {/* Placeholder Avatar */}
            <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-serif font-bold ${isFeatured ? "bg-[#003262] text-white" : "bg-slate-100 text-slate-400"
                }`}>
                {image ? (
                    <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    name.charAt(0)
                )}
            </div>

            <h3 className={`font-serif font-bold mb-1 ${isFeatured ? "text-xl text-[#003262]" : "text-lg text-slate-800"}`}>
                {name}
            </h3>
            <p className="text-sm text-slate-500 mb-6 uppercase tracking-wide font-medium">
                {title}
            </p>

            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${isFeatured
                            ? "bg-[#003262] text-white hover:bg-[#FDB515] hover:text-[#003262]"
                            : "border border-slate-300 text-slate-600 hover:border-[#003262] hover:text-[#003262]"
                        }`}
                >
                    View Profile
                </a>
            ) : (
                <span className="text-xs text-slate-300 font-mono select-none">Institutional Profile</span>
            )}
        </div>
    );
}
