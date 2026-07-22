interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`glass-card p-6 border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl text-slate-100 shadow-2xl rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
