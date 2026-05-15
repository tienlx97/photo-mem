"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, Radio, RadioGroup } from "react-aria-components";
import { categories, journalPrompts, moods } from "@/lib/mock-data";
import { Field, SelectField, SelectItem, TextAreaField } from "@/components/ui";

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
                <Image src={image} alt="" fill sizes="(max-width: 820px) 30vw, 180px" />
                <span>{index === 0 ? "Cover" : index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <Field label="Tiêu đề" defaultValue="Một buổi chiều đáng nhớ" />

          <TextAreaField
            label="Nhật ký ngắn"
            rows={6}
            defaultValue="Mình muốn nhớ lại ánh sáng, âm thanh và cảm giác lúc hai đứa vừa đến nơi này."
          />

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

          <RadioGroup
            aria-label="Cách gắn địa điểm"
            className="segmented"
            value={locationMode}
            onChange={setLocationMode}
          >
            <Radio className="segmented-option" value="gps">
              ⌖ GPS
            </Radio>
            <Radio className="segmented-option" value="search">
              ⌕ Tìm kiếm
            </Radio>
            <Radio className="segmented-option" value="pin">
              ◉ Chọn bản đồ
            </Radio>
          </RadioGroup>

          <Field label="Tên địa điểm" defaultValue="Kokoro Cafe" />

          <Field label="Địa chỉ" defaultValue="45 Đặng Thái Thân, Đà Lạt" />

          <div className="location-picker">
            <span className="location-pin" />
          </div>
        </div>

        <div className="form-section">
          <div className="field-grid">
            <SelectField label="Nhóm" defaultSelectedKey="coffee">
                {categories.map((category) => (
                  <SelectItem id={category.id} key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectField>

            <SelectField label="Cảm xúc" defaultSelectedKey="peaceful">
                {moods.map((mood) => (
                  <SelectItem id={mood.id} key={mood.id}>
                    {mood.name}
                  </SelectItem>
                ))}
            </SelectField>
          </div>

          <Field label="Ngày kỷ niệm" type="date" defaultValue="2026-04-27" />

          <RadioGroup
            aria-label="Trạng thái lưu"
            className="visibility-choice"
            defaultValue="private"
          >
            <Radio value="private">
              <span>Chỉ hai người</span>
            </Radio>
            <Radio value="draft">
              <span>Bản nháp</span>
            </Radio>
          </RadioGroup>

          <Button className="btn btn-primary submit-btn" type="submit">
            <span aria-hidden="true">✓</span>
            Lưu kỷ niệm
          </Button>
        </div>
      </aside>
    </form>
  );
}
