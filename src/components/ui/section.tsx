import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}

export function Section({ children, className = "", id, "aria-labelledby": ariaLabelledby }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${className}`}
      aria-labelledby={ariaLabelledby}
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
