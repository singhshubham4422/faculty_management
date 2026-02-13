interface BadgeProps {
    label: string;
    variant?: "gold" | "slate" | "default";
}

export default function Badge({ label, variant = "default" }: BadgeProps) {
    const styles = {
        gold: "bg-[#FDB515] text-[#003262] border-[#FDB515]",
        slate: "bg-slate-100 text-slate-600 border-slate-200",
        default: "bg-slate-100 text-slate-800 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold border ${styles[variant]}`}
        >
            {label}
        </span>
    );
}
