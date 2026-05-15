"use client";

import Link from "next/link";
import { useState } from "react";
import { moods } from "@/lib/mock-data";

export function QuickMemoryPanel({ embedded = false }) {
  const [saved, setSaved] = useState(false);
  const [location, setLocation] = useState("Quán nhỏ tụi mình thích");

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocation("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setLocation("Đang lấy vị trí hiện tại...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      },
      () => {
        setLocation("Chưa cấp quyền vị trí");
      }
    );
  }

  return (
    <form
      className="quick-memory-panel"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      {!embedded ? (
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Thêm nhanh</p>
            <h2>Kỷ niệm mới</h2>
          </div>
          <Link href="/checkins/new" className="text-link">
            Form đầy đủ
          </Link>
        </div>
      ) : null}

      <label className="quick-upload" htmlFor="quick-photos">
        <input id="quick-photos" type="file" accept="image/*,video/*" multiple />
        <span aria-hidden="true">+</span>
        <strong>Thêm ảnh hoặc video</strong>
      </label>

      <label className="field">
        <span>Tiêu đề *</span>
        <input required defaultValue="Một buổi chiều đáng nhớ" />
      </label>

      <div className="field-grid compact">
        <label className="field">
          <span>Ngày *</span>
          <input type="date" required defaultValue="2026-05-15" />
        </label>

        <label className="field">
          <span>Cảm xúc</span>
          <select defaultValue="memorable">
            {moods.map((mood) => (
              <option value={mood.id} key={mood.id}>
                {mood.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Địa điểm</span>
        <input value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>

      <label className="field">
        <span>Ghi chú</span>
        <textarea rows={4} defaultValue="Điều mình muốn nhớ nhất là..." />
      </label>

      <div className="quick-actions">
        <button className="btn btn-primary" type="submit">
          <span aria-hidden="true">+</span>
          Lưu kỷ niệm
        </button>
        <button className="btn btn-secondary" type="button" onClick={useCurrentLocation}>
          <span aria-hidden="true">⌖</span>
          Vị trí hiện tại
        </button>
      </div>

      {saved ? <p className="save-state">Đã lưu bản nháp trên màn hình.</p> : null}
    </form>
  );
}
