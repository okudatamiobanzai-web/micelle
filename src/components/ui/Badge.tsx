interface BadgeProps {
  text: string;
  bgClass?: string;
  fgClass?: string;
  icon?: string;
}

export function Badge({ text, bgClass = "bg-primary-50", fgClass = "text-primary-800", icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-medium tracking-tight px-2.5 py-0.5 rounded-xl whitespace-nowrap ${bgClass} ${fgClass}`}
    >
      {icon && <span className="text-[10px]">{icon}</span>}
      {text}
    </span>
  );
}
