"use client";

import { useState, type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor?: string; // CSS color for left border
}

export function Card({ children, onClick, className = "", accentColor }: CardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`mx-4 my-2 p-4 bg-background rounded-[14px] relative overflow-hidden transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${pressed ? "scale-[0.98] shadow-none" : "shadow-[0_1px_3px_rgba(0,0,0,.04),0_1px_2px_rgba(0,0,0,.03)]"} ${className}`}
      style={{
        borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
      }}
    >
      {children}
    </div>
  );
}
