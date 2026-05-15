"use client";

import { useState } from "react";
import { Button, Input, Link } from "react-aria-components";
import { moods } from "@/lib/mock-data";
import { Field, SelectField, SelectItem, TextAreaField } from "@/components/ui";

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
        <Input id="quick-photos" type="file" accept="image/*,video/*" multiple />
        <span aria-hidden="true">+</span>
        <strong>Thêm ảnh hoặc video</strong>
      </label>

      <Field isRequired label="Tiêu đề *" defaultValue="Một buổi chiều đáng nhớ" />

      <div className="field-grid compact">
        <Field isRequired label="Ngày *" type="date" defaultValue="2026-05-15" />

        <SelectField label="Cảm xúc" defaultSelectedKey="memorable">
          {moods.map((mood) => (
            <SelectItem id={mood.id} key={mood.id}>
              {mood.name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <Field label="Địa điểm" value={location} onChange={setLocation} />

      <TextAreaField label="Ghi chú" rows={4} defaultValue="Điều mình muốn nhớ nhất là..." />

      <div className="quick-actions">
        <Button className="btn btn-primary" type="submit">
          <span aria-hidden="true">+</span>
          Lưu kỷ niệm
        </Button>
        <Button className="btn btn-secondary" type="button" onPress={useCurrentLocation}>
          <span aria-hidden="true">⌖</span>
          Vị trí hiện tại
        </Button>
      </div>

      {saved ? <p className="save-state">Đã lưu bản nháp trên màn hình.</p> : null}
    </form>
  );
}
