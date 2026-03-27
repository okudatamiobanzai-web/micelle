"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Chip } from "@/components/ui/Chip";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { MilkBadge } from "@/components/ui/MilkBadge";
import { fetchPeople } from "@/lib/data";
import type { Profile } from "@/lib/types";

const FILTERS = ["すべて", "milk紹介", "デザイン", "力仕事", "不動産", "写真撮影", "IT", "送迎", "DIY"];

export default function PeoplePage() {
  const router = useRouter();
  const [filter, setFilter] = useState("すべて");
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetchPeople()
      .then((dbPeople) => {
        setPeople(dbPeople);
      })
      .catch(() => { setLoadError(true); })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "すべて"
      ? people
      : filter === "milk紹介"
        ? people.filter((p) => p.is_milk_endorsed)
        : people.filter((p) => p.can?.some((c) => c.includes(filter)));

  const sorted = [...filtered];

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
                  ? people.filter((p) => p.is_milk_endorsed).length
                  : undefined
            }
          />
        ))}
      </div>

      {/* Count */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-xs text-gray-400">
          {loading ? "読み込み中..." : `${sorted.length}人`}
        </span>
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
              <Orb ch={person.avatar_char} dots={0} size={48} colorClass="primary" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[15px] font-semibold text-foreground">{person.display_name}</span>
                  {person.is_milk_endorsed && <MilkBadge />}
                </div>
                <div className="text-xs text-gray-400 mb-2">{person.area}</div>

                {/* Skills */}
                {person.can && person.can.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {person.can.map((skill) => (
                      <SkillBadge key={skill} skill={skill} variant="compact" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && loadError && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <div className="text-sm text-gray-400 mb-3">読み込みに失敗しました</div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-primary-600 bg-primary-50 px-4 py-2 rounded-lg border-none cursor-pointer"
            >
              再読み込み
            </button>
          </div>
        )}
        {!loading && !loadError && sorted.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">👤</div>
            <div className="text-sm text-gray-400">まだ登録されている人がいません</div>
          </div>
        )}
      </div>
    </div>
  );
}
