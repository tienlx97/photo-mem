"use client";

import dynamic from "next/dynamic";

const CheckinMap = dynamic(
  () => import("@/components/checkin-map").then((module) => module.CheckinMap),
  {
    ssr: false,
    loading: () => (
      <section className="map-workspace">
        <div className="map-loading">Đang tải bản đồ kỷ niệm...</div>
      </section>
    )
  }
);

export function MapSection() {
  return <CheckinMap />;
}
