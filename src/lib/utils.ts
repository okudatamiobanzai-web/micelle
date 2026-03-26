import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Calculate activity dots (0-8) from profile stats */
export function calcDots(stats: {
  completedHelp?: number;
  referrals?: number;
  giftedTags?: string[];
}): number {
  return Math.min(
    8,
    (stats.completedHelp ?? 0) +
      (stats.referrals ?? 0) +
      (stats.giftedTags?.length ?? 0)
  );
}
