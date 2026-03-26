interface NavIconProps {
  type: "board" | "post" | "people" | "mypage";
  active: boolean;
}

export function NavIcon({ type, active }: NavIconProps) {
  const c = active ? "var(--color-primary-600)" : "var(--color-gray-400)";

  if (type === "board") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke={c} fill="none" strokeWidth="1.3" />
        <path d="M7 8h8M7 11h5M7 14h6" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "post") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="8" stroke={c} fill="none" strokeWidth="1.3" />
        <path d="M11 7v8M7 11h8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "people") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="9" cy="8" r="3" stroke={c} fill="none" strokeWidth="1.3" />
        <circle cx="15" cy="9" r="2.5" stroke={c} fill="none" strokeWidth="1.3" />
        <path d="M3 18c0-3 2.5-5.5 6-5.5s4 1 5 2" stroke={c} fill="none" strokeWidth="1.3" />
      </svg>
    );
  }
  if (type === "mypage") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="8" r="3.5" stroke={c} fill="none" strokeWidth="1.3" />
        <path d="M4 19c0-3.5 3-6.5 7-6.5s7 3 7 6.5" stroke={c} fill="none" strokeWidth="1.3" />
      </svg>
    );
  }
  return null;
}
