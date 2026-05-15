"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import {
  FocusScope,
  mergeProps,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll
} from "react-aria";
import { Button, Pressable } from "react-aria-components";
import { QuickMemoryPanel } from "@/components/quick-memory-panel";
import {
  categories,
  checkins,
  formatDate,
  getCategory,
  getCoverImage,
  getMemoryMedia,
  getMediaSummary,
  getMood,
  moods
} from "@/lib/mock-data";

const DEFAULT_CENTER = [12.35, 107.85];

function fitMapToCheckins(map, visibleCheckins, options = {}) {
  if (!map || visibleCheckins.length === 0) {
    return;
  }

  if (visibleCheckins.length === 1) {
    const [checkin] = visibleCheckins;
    map.flyTo([checkin.latitude, checkin.longitude], options.zoom ?? 13, {
      duration: 0.55
    });
    return;
  }

  const bounds = visibleCheckins.map((checkin) => [checkin.latitude, checkin.longitude]);

  map.fitBounds(bounds, {
    padding: options.padding ?? [58, 58],
    maxZoom: options.maxZoom ?? 9,
    animate: true
  });
}

function createCheckinIcon(checkin, isActive) {
  const category = getCategory(checkin.categoryId);
  const coverImage = getCoverImage(checkin);
  const width = 54;
  const height = 64;
  const anchorY = 58;

  return L.divIcon({
    className: "checkin-leaflet-icon",
    html: `
      <span class="explory-memory-marker${isActive ? " active" : ""}" style="--marker-color: ${category.color}">
        ${isActive ? '<span class="explory-marker-pulse"></span>' : ""}
        <span class="explory-marker-core">
          <span class="explory-marker-photo" style="background-image: url('${coverImage}')"></span>
          <span class="explory-marker-glass"></span>
          <span class="explory-marker-camera" aria-hidden="true"></span>
        </span>
        <span class="explory-marker-tip" aria-hidden="true"></span>
      </span>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
    popupAnchor: [0, -anchorY],
    tooltipAnchor: [0, -(anchorY + 8)]
  });
}

function FitBounds({ visibleCheckins }) {
  const map = useMap();

  useEffect(() => {
    fitMapToCheckins(map, visibleCheckins);
  }, [map, visibleCheckins]);

  return null;
}

function MapControls({ activeCheckin, visibleCheckins, onAddMemory }) {
  const map = useMap();
  const [locationStatus, setLocationStatus] = useState("");

  function resetView() {
    if (visibleCheckins.length > 1) {
      fitMapToCheckins(map, visibleCheckins);
      return;
    }

    if (activeCheckin) {
      map.flyTo([activeCheckin.latitude, activeCheckin.longitude], 13, { duration: 0.55 });
      return;
    }

    map.flyTo(DEFAULT_CENTER, 6, { duration: 0.55 });
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationStatus("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setLocationStatus("Đang lấy vị trí...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14, { duration: 0.55 });
        setLocationStatus("Đã đến vị trí hiện tại");
      },
      () => {
        setLocationStatus("Chưa cấp quyền vị trí");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000
      }
    );
  }

  return (
    <div className="explory-map-controls" aria-label="Điều khiển bản đồ">
      <div className="explory-control-group">
        <button
          type="button"
          title="Phóng to"
          aria-label="Phóng to"
          onClick={() => map.zoomIn()}
        >
          +
        </button>
        <span aria-hidden="true" />
        <button
          type="button"
          title="Thu nhỏ"
          aria-label="Thu nhỏ"
          onClick={() => map.zoomOut()}
        >
          -
        </button>
      </div>

      <div className="explory-control-button">
        <button type="button" title="Đưa về hành trình" aria-label="Đưa về hành trình" onClick={resetView}>
          <span className="control-compass" aria-hidden="true" />
        </button>
      </div>

      <div className="explory-control-button">
        <button type="button" title="Vị trí hiện tại" aria-label="Vị trí hiện tại" onClick={locateUser}>
          <span className="control-location" aria-hidden="true" />
        </button>
      </div>

      <div className="explory-control-button primary">
        <button type="button" title="Thêm kỷ niệm" aria-label="Thêm kỷ niệm" onClick={onAddMemory}>
          +
        </button>
      </div>

      {locationStatus ? <p className="explory-location-status">{locationStatus}</p> : null}
    </div>
  );
}

function getBounds(checkinList) {
  if (checkinList.length === 0) {
    return null;
  }

  const latitudes = checkinList.map((checkin) => checkin.latitude);
  const longitudes = checkinList.map((checkin) => checkin.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    coverage: Math.abs((maxLat - minLat) * (maxLng - minLng) * 111 * 111)
  };
}

function MapInfoPanel({
  bounds,
  categoryId,
  filteredCount,
  moodId,
  onAddMemory,
  onCategoryChange,
  onMoodChange
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="explory-map-info" aria-label="Thông tin bản đồ kỷ niệm">
      <div className="explory-info-summary">
        <div className="explory-info-icon" aria-hidden="true">
          <span />
        </div>

        <div className="explory-info-content">
          <div className="explory-info-title-row">
            <h1>Bản đồ kỷ niệm</h1>
            <button
              type="button"
              className="explory-info-toggle"
              aria-expanded={expanded}
              aria-label={expanded ? "Thu gọn thông tin bản đồ" : "Mở thông tin bản đồ"}
              onClick={() => setExpanded((value) => !value)}
            >
              <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
            </button>
          </div>

          <div className="explory-found-pill">
            <span aria-hidden="true" />
            {filteredCount} địa điểm phù hợp
          </div>
        </div>
      </div>

      <div className="explory-info-actions">
        <button className="btn btn-primary" type="button" onClick={onAddMemory}>
          <span aria-hidden="true">+</span>
          Thêm kỷ niệm
        </button>
      </div>

      <div className={expanded ? "explory-info-detail open" : "explory-info-detail"}>
        <div className="explory-filter-grid" aria-label="Bộ lọc bản đồ">
          <label>
            <span>Nhóm</span>
            <select value={categoryId} onChange={(event) => onCategoryChange(event.target.value)}>
              <option value="all">Tất cả</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Cảm xúc</span>
            <select value={moodId} onChange={(event) => onMoodChange(event.target.value)}>
              <option value="all">Tất cả</option>
              {moods.map((mood) => (
                <option value={mood.id} key={mood.id}>
                  {mood.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {bounds ? (
          <div className="explory-range-panel">
            <div className="explory-range-title">
              <span className="range-location-icon" aria-hidden="true" />
              <span>Vùng kỷ niệm</span>
            </div>

            <div className="explory-range-grid">
              <CoordinateCard
                title="Tây nam"
                latitude={bounds.minLat}
                longitude={bounds.minLng}
                direction="southwest"
              />
              <CoordinateCard
                title="Đông bắc"
                latitude={bounds.maxLat}
                longitude={bounds.maxLng}
                direction="northeast"
              />
            </div>

            <div className="explory-coverage">
              <span className="coverage-grid-icon" aria-hidden="true" />
              Hành trình phủ khoảng {bounds.coverage.toFixed(1)} km²
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function CoordinateCard({ direction, latitude, longitude, title }) {
  return (
    <div className="explory-coordinate-card">
      <div className="coordinate-card-title">
        <span className={direction} aria-hidden="true" />
        {title}
      </div>
      <div className="coordinate-line">
        <span>Lat</span>
        <strong>{latitude.toFixed(6)}°</strong>
      </div>
      <div className="coordinate-line">
        <span>Lng</span>
        <strong>{longitude.toFixed(6)}°</strong>
      </div>
    </div>
  );
}

export function CheckinMap() {
  const [categoryId, setCategoryId] = useState("all");
  const [moodId, setMoodId] = useState("all");
  const [activeId, setActiveId] = useState(checkins[0]?.id);
  const [drawerMode, setDrawerMode] = useState(null);
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const hoverCloseTimerRef = useRef(null);

  const filteredCheckins = useMemo(() => {
    return checkins.filter((checkin) => {
      const categoryMatch = categoryId === "all" || checkin.categoryId === categoryId;
      const moodMatch = moodId === "all" || checkin.moodId === moodId;
      return categoryMatch && moodMatch;
    });
  }, [categoryId, moodId]);

  useEffect(() => {
    if (!filteredCheckins.some((checkin) => checkin.id === activeId)) {
      setActiveId(filteredCheckins[0]?.id);
    }
  }, [activeId, filteredCheckins]);

  const activeCheckin =
    filteredCheckins.find((checkin) => checkin.id === activeId) ?? filteredCheckins[0];

  const bounds = useMemo(() => getBounds(filteredCheckins), [filteredCheckins]);

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        window.clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  function keepPreviewOpen() {
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }

  function showHoverPreview(checkinId) {
    keepPreviewOpen();
    setHoveredPreviewId(checkinId);
  }

  function scheduleCloseHoverPreview() {
    keepPreviewOpen();
    hoverCloseTimerRef.current = window.setTimeout(() => {
      setHoveredPreviewId(null);
    }, 180);
  }

  function openMemory(checkinId) {
    keepPreviewOpen();
    setActiveId(checkinId);
    setHoveredPreviewId(null);
    setDrawerMode("memory");
  }

  return (
    <section className="map-workspace">
      <div className="map-body">
        <Link href="/checkins" className="explory-back-button" aria-label="Quay lại danh sách">
          <span aria-hidden="true">‹</span>
        </Link>

        <MapInfoPanel
          bounds={bounds}
          categoryId={categoryId}
          filteredCount={filteredCheckins.length}
          moodId={moodId}
          onAddMemory={() => setDrawerMode("add")}
          onCategoryChange={setCategoryId}
          onMoodChange={setMoodId}
        />

        <div className="leaflet-map-shell">
          {filteredCheckins.length > 0 ? (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={6}
              minZoom={4}
              maxZoom={18}
              zoomControl={false}
              scrollWheelZoom
              className="checkin-leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds visibleCheckins={filteredCheckins} />
              <MapControls
                activeCheckin={activeCheckin}
                visibleCheckins={filteredCheckins}
                onAddMemory={() => setDrawerMode("add")}
              />

              {filteredCheckins.map((checkin) => {
                const isActive = checkin.id === activeId || checkin.id === hoveredPreviewId;

                return (
                  <Marker
                    key={checkin.id}
                    position={[checkin.latitude, checkin.longitude]}
                    icon={createCheckinIcon(checkin, isActive)}
                    eventHandlers={{
                      click: () => openMemory(checkin.id),
                      mouseover: () => showHoverPreview(checkin.id),
                      mouseout: scheduleCloseHoverPreview
                    }}
                  >
                    {hoveredPreviewId === checkin.id ? (
                      <Tooltip
                        className="memory-hover-tooltip"
                        direction="top"
                        interactive
                        offset={[0, 0]}
                        opacity={1}
                        permanent
                      >
                        <MemoryMediaPreview
                          checkin={checkin}
                          onMouseEnter={keepPreviewOpen}
                          onMouseLeave={scheduleCloseHoverPreview}
                          onPress={() => openMemory(checkin.id)}
                          variant="hover"
                        />
                      </Tooltip>
                    ) : null}
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="map-empty-state">
              <h2>Chưa có kỷ niệm phù hợp</h2>
              <p>Thử đổi bộ lọc nhóm hoặc cảm xúc.</p>
            </div>
          )}
        </div>

        {drawerMode ? (
          <MapDrawerOverlay
            activeCheckin={activeCheckin}
            drawerMode={drawerMode}
            onClose={() => setDrawerMode(null)}
          />
        ) : null}
      </div>
    </section>
  );
}

function MapDrawerOverlay({ activeCheckin, drawerMode, onClose }) {
  const drawerRef = useRef(null);
  const titleRef = useRef(null);
  const isAddDrawer = drawerMode === "add";
  const title = isAddDrawer ? "Thêm kỷ niệm" : activeCheckin?.title ?? "Thông tin kỷ niệm";

  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: isAddDrawer,
      isKeyboardDismissDisabled: false,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: () => isAddDrawer
    },
    drawerRef
  );
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, drawerRef);

  usePreventScroll({ isDisabled: false });

  return (
    <FocusScope autoFocus contain restoreFocus>
      {isAddDrawer ? (
        <div
          {...underlayProps}
          className="drawer-backdrop"
          role="presentation"
        />
      ) : (
        <div className="drawer-backdrop map-lock-backdrop" aria-hidden="true" />
      )}
      <aside
        {...mergeProps(overlayProps, dialogProps, modalProps)}
        ref={drawerRef}
        className={isAddDrawer ? "map-drawer add-drawer" : "map-drawer memory-drawer"}
      >
        <span className="drawer-handle" aria-hidden="true" />
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{isAddDrawer ? "Thêm mới" : "Kỷ niệm"}</p>
            <h2 {...titleProps} ref={titleRef}>
              {title}
            </h2>
          </div>
          <Button
            aria-label="Đóng drawer"
            className="icon-btn"
            type="button"
            onPress={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Đóng</span>
          </Button>
        </div>

        {isAddDrawer ? (
          <QuickMemoryPanel embedded />
        ) : activeCheckin ? (
          <MemoryDrawerContent checkin={activeCheckin} />
        ) : null}
      </aside>
    </FocusScope>
  );
}

function MemoryDrawerContent({ checkin }) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);

  return (
    <article className="drawer-memory">
      <MemoryMediaPreview checkin={checkin} variant="drawer" />

      <div className="tag-row">
        <span className="pill" style={{ "--pill-color": category.color }}>
          {category.icon} · {category.name}
        </span>
        <span className="pill muted">{mood.icon} · {mood.name}</span>
      </div>

      <p className="journal-text">{checkin.caption}</p>

      <dl className="meta-list drawer-meta">
        <div>
          <dt>Địa điểm</dt>
          <dd>{checkin.locationName}</dd>
        </div>
        <div>
          <dt>Ngày kỷ niệm</dt>
          <dd>{formatDate(checkin.checkinTime)}</dd>
        </div>
        <div>
          <dt>Người thêm</dt>
          <dd>{checkin.createdBy}</dd>
        </div>
      </dl>

      <div className="detail-actions">
        <Link href={`/checkins/${checkin.id}`} className="btn btn-primary">
          Đọc bài viết
        </Link>
        <button className="btn btn-secondary" type="button">
          Chỉnh sửa
        </button>
      </div>
    </article>
  );
}

function MemoryMediaPreview({ checkin, onMouseEnter, onMouseLeave, onPress, variant }) {
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const visibleMedia = media.slice(0, variant === "drawer" ? 8 : 6);
  const remainingCount = Math.max(media.length - visibleMedia.length, 0);
  const isHoverPreview = variant === "hover";

  const preview = (
    <article
      className={`memory-media-preview ${variant}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={isHoverPreview ? `Xem chi tiết ${checkin.title}` : undefined}
    >
      <div className="memory-preview-head">
        <div>
          <p>{mediaSummary.total} media</p>
          <h3>{checkin.title}</h3>
        </div>
        {isHoverPreview ? (
          <span className="memory-preview-action" aria-hidden="true">
            Xem
          </span>
        ) : null}
      </div>

      <div className="memory-preview-grid" aria-label="Ảnh và video trong kỷ niệm">
        {visibleMedia.map((item) => (
          <span className="memory-preview-tile" key={item.id}>
            <img src={item.type === "video" ? item.poster : item.url} alt={item.alt ?? ""} />
            {item.type === "video" ? <i aria-label="Video" /> : null}
          </span>
        ))}
        {remainingCount > 0 ? (
          <span className="memory-preview-more">
            <strong>+{remainingCount}</strong>
            <small>More</small>
          </span>
        ) : null}
      </div>

      <dl className="memory-preview-meta">
        <div>
          <dt>Vị trí</dt>
          <dd className="coordinate-value">
            {checkin.latitude.toFixed(4)}° N, {checkin.longitude.toFixed(4)}° E
          </dd>
        </div>
        <div>
          <dt>Thời gian</dt>
          <dd>{formatDate(checkin.checkinTime)}</dd>
        </div>
        {variant === "drawer" ? (
          <div>
            <dt>Media</dt>
            <dd>
              {mediaSummary.photos} ảnh{mediaSummary.videos ? `, ${mediaSummary.videos} video` : ""}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{preview}</Pressable>;
  }

  return preview;
}
