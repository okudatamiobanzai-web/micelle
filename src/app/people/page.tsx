"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Chip } from "@/components/ui/Chip";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { MilkBadge } from "@/components/ui/MilkBadge";
import { people } from "@/lib/sample-data";

const FILTERS = ["すべて", "milk紹介", "デザイン", "力仕事", "不動産", "写真撮影"];

export default function PeoplePage() {
  const router = useRouter();
  const [filter, setFilter] = useState("すべて");

  const filtered =
    filter === "すべて"
      ? people
      : filter === "milk紹介"
        ? people.filter((p) => p.milkComment)
        : people.filter((p) => p.can.some((c) => c.includes(filter)));

  // Sort by activity (dots) descending
  const sorted = [...filtered].sort((a, b) => b.dots - a.dots);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">見せる</div>
        <div className="text-[11px] text-gray-400 mt-0.5">milkでつながる人たち</div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto">
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            selected={filter === f}
            onClick={() => setFilter(f)}
            count={
              f === "すべて"
                ? people.length
                : f === "milk紹介"
                  ? people.filter((p) => p.milkComment).length
                  : undefined
            }
          />
        ))}
      </div>

      {/* Count */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-xs text-gray-400">{sorted.length}人</span>
      </div>

      {/* People list */}
      <div className="pb-24">
        {sorted.map((person) => (
          <div
            key={person.id}
            onClick={() => router.push(`/people/${person.id}`)}
            className="mx-4 my-2 p-4 bg-background rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_1px_2px_rgba(0,0,0,.03)] cursor-pointer active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <Orb ch={person.ch} dots={person.dots} size={48} colorClass={person.colorClass} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[15px] font-semibold text-foreground">{person.name}</span>
                  {person.milkComment && <MilkBadge />}
                </div>
                <div className="text-xs text-gray-400 mb-2">{person.area}</div>

                {/* Skills */}
                <div className="flex gap-1 flex-wrap mb-2">
                  {person.can.map((skill) => (
                    <SkillBadge key={skill} skill={skill} variant="compact" />
                  ))}
                </div>

                {/* Gifted tags */}
                {person.gifted.length > 0 && (
                  <GiftedTags tags={person.gifted.slice(0, 3)} />
                )}
              </div>

              {/* Stats */}
              <div className="text-right shrink-0">
                <div className="text-[11px] text-gray-400">お手伝い</div>
                <div className="text-lg font-bold text-primary-600">{person.completedHelp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
