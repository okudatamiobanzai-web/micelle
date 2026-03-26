"use client";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  count?: number;
}

export function Chip({ label, selected, onClick, count }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-200 ${
        selected
          ? "bg-primary-400 text-white font-semibold border border-primary-400 shadow-[0_2px_8px_rgba(29,158,117,.2)]"
          : "bg-transparent text-gray-600 font-normal border border-gray-100"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-px rounded-lg ${
            selected ? "bg-white/25 text-white" : "bg-gray-50 text-gray-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
