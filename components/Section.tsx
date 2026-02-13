import type { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string; // Allow additional classes (like bg colors)
    id?: string;
}

export default function Section({ children, className = "", id }: SectionProps) {
    return (
        <section id={id} className={`py-16 md:py-24 ${className}`}>
            <div className="container-academic">
                {children}
            </div>
        </section>
    );
}
