"use client";

import { useState } from "react";
import { Button } from "react-aria-components";
import { categories, journalPrompts, moods } from "@/lib/mock-data";

const previewImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
];

export function CheckinFormMock() {
  const [activePrompt, setActivePrompt] = useState(journalPrompts[1]);
  const [locationMode, setLocationMode] = useState("search");

  return (
    <form className="create-layout" onSubmit={(event) => event.preventDefault()}>
      <section className="form-panel">
        <div className="form-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Ảnh kỷ niệm</p>
              <h2>Chọn ảnh đại diện</h2>
            </div>
          </div>

          <div className="upload-zone">
            <span aria-hidden="true">⇧</span>
            <strong>Kéo ảnh/video vào đây hoặc chọn từ thiết bị</strong>
            <small>Tối đa 10 media cho một kỷ niệm, có thể gồm ảnh và video ngắn.</small>
          </div>

          <div className="preview-row">
            {previewImages.map((image, index) => (
              <div className="preview-item" key={image}>
                <img src={image} alt="" />
                <span>{index === 0 ? "Cover" : index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="field">
            <span>Tiêu đề</span>
            <input defaultValue="Một buổi chiều đáng nhớ" />
          </label>

          <label className="field">
            <span>Nhật ký ngắn</span>
            <textarea
              rows={6}
              defaultValue="Mình muốn nhớ lại ánh sáng, âm thanh và cảm giác lúc hai đứa vừa đến nơi này."
            />
          </label>

          <div className="prompt-list" aria-label="Gợi ý viết nhật ký">
            {journalPrompts.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                className={activePrompt === prompt ? "prompt-chip active" : "prompt-chip"}
                onPress={() => setActivePrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <aside className="form-panel sticky-panel">
        <div className="form-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Vị trí</p>
              <h2>Gắn địa điểm</h2>
            </div>
          </div>

          <div className="segmented">
            <Button
              type="button"
              className={locationMode === "gps" ? "active" : ""}
              onPress={() => setLocationMode("gps")}
            >
              ⌖ GPS
            </Button>
            <Button
              type="button"
              className={locationMode === "search" ? "active" : ""}
              onPress={() => setLocationMode("search")}
            >
              ⌕ Tìm kiếm
            </Button>
            <Button
              type="button"
              className={locationMode === "pin" ? "active" : ""}
              onPress={() => setLocationMode("pin")}
            >
              ◉ Chọn bản đồ
            </Button>
          </div>

          <label className="field">
            <span>Tên địa điểm</span>
            <input defaultValue="Kokoro Cafe" />
          </label>

          <label className="field">
            <span>Địa chỉ</span>
            <input defaultValue="45 Đặng Thái Thân, Đà Lạt" />
          </label>

          <div className="location-picker">
            <span className="location-pin" />
          </div>
        </div>

        <div className="form-section">
          <div className="field-grid">
            <label className="field">
              <span>Nhóm</span>
              <select defaultValue="coffee">
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Cảm xúc</span>
              <select defaultValue="peaceful">
                {moods.map((mood) => (
                  <option value={mood.id} key={mood.id}>
                    {mood.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Ngày kỷ niệm</span>
            <input type="date" defaultValue="2026-04-27" />
          </label>

          <div className="visibility-choice" role="radiogroup" aria-label="Trạng thái lưu">
            <label>
              <input type="radio" name="visibility" defaultChecked />
              <span>Chỉ hai người</span>
            </label>
            <label>
              <input type="radio" name="visibility" />
              <span>Bản nháp</span>
            </label>
          </div>

          <Button className="btn btn-primary submit-btn" type="submit">
            <span aria-hidden="true">✓</span>
            Lưu kỷ niệm
          </Button>
        </div>
      </aside>
    </form>
  );
}
