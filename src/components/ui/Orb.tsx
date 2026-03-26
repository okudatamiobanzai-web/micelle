"use client";

interface OrbProps {
  ch: string;
  dots?: number;
  size?: number;
  colorClass?: string; // e.g. "primary", "purple", "blue"
  pulse?: boolean;
  onClick?: () => void;
}

/**
 * Orb: ドット付きアバター
 * dots: 活動ドット数(0-8), size: px, colorClass: Tailwind color prefix
 */
export function Orb({
  ch,
  dots = 0,
  size = 40,
  colorClass = "primary",
  pulse = false,
  onClick,
}: OrbProps) {
  const r = size * 0.52;
  const innerSize = size * 0.68;
  const dotSize = size * 0.1;

  // Generate dot positions
  const dotPositions = Array.from({ length: dots }, (_, i) => {
    const angle = (i / Math.max(dots, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      left: Math.cos(angle) * r + size / 2 - dotSize / 2,
      top: Math.sin(angle) * r + size / 2 - dotSize / 2,
    };
  });

  return (
    <div
      onClick={onClick}
      className="relative shrink-0"
      style={{ width: size, height: size, cursor: onClick ? "pointer" : "default" }}
    >
      {/* Glow ring */}
      {dots > 0 && (
        <div
          className={`absolute top-1/2 left-1/2 rounded-full bg-${colorClass}-200/10`}
          style={{
            width: size * 1.4,
            height: size * 1.4,
            transform: "translate(-50%, -50%)",
            animation: pulse ? "orb-pulse 3s ease-in-out infinite" : "none",
          }}
        />
      )}

      {/* Center circle */}
      <div
        className={`absolute top-1/2 left-1/2 rounded-full flex items-center justify-center font-semibold z-2 bg-gradient-to-br from-${colorClass}-50 to-white border-[1.5px] border-${colorClass}-200 text-${colorClass}-800 shadow-sm`}
        style={{
          width: innerSize,
          height: innerSize,
          transform: "translate(-50%, -50%)",
          fontSize: size * 0.26,
          zIndex: 2,
        }}
      >
        {ch}
      </div>

      {/* Activity dots */}
      {dotPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-${colorClass}-400`}
          style={{
            left: pos.left,
            top: pos.top,
            width: dotSize,
            height: dotSize,
            zIndex: 3,
          }}
        />
      ))}
    </div>
  );
}
