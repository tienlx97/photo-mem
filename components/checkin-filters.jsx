"use client";

import { useMemo, useState } from "react";
import { categories, checkins, moods } from "@/lib/mock-data";
import { CheckinCard } from "@/components/checkin-card";

export function CheckinFilters() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [moodId, setMoodId] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...checkins]
      .filter((checkin) => {
        const queryMatch =
          !normalizedQuery ||
          checkin.title.toLowerCase().includes(normalizedQuery) ||
          checkin.locationName.toLowerCase().includes(normalizedQuery) ||
          checkin.city.toLowerCase().includes(normalizedQuery);
        const categoryMatch = categoryId === "all" || checkin.categoryId === categoryId;
        const moodMatch = moodId === "all" || checkin.moodId === moodId;
        return queryMatch && categoryMatch && moodMatch;
      })
      .sort((a, b) => {
        const left = new Date(a.checkinTime).getTime();
        const right = new Date(b.checkinTime).getTime();
        return sort === "newest" ? right - left : left - right;
      });
  }, [categoryId, moodId, query, sort]);

  return (
    <>
      <section className="filter-panel" aria-label="Tìm kiếm và lọc kỷ niệm">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tiêu đề, ghi chú hoặc địa điểm"
          />
        </label>

        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="all">Tất cả nhóm</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select value={moodId} onChange={(event) => setMoodId(event.target.value)}>
          <option value="all">Tất cả cảm xúc</option>
          {moods.map((mood) => (
            <option value={mood.id} key={mood.id}>
              {mood.name}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </section>

      <section className="library-summary" aria-label="Tổng quan thư viện">
        <div>
          <span>{filtered.length}</span>
          <strong>kỷ niệm phù hợp</strong>
        </div>
        <p>Thư viện ưu tiên ảnh lớn, metadata gọn và bộ lọc nhanh theo nơi chốn, nhóm và cảm xúc.</p>
      </section>

      <section className="checkin-grid gallery-grid" aria-label="Danh sách kỷ niệm">
        {filtered.map((checkin) => (
          <CheckinCard checkin={checkin} key={checkin.id} />
        ))}
      </section>
    </>
  );
}
