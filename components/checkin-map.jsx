"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
  const width = 44;
  const height = 54;
  const anchorY = 50;

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

export function CheckinMap() {
  const [activeId, setActiveId] = useState(null);
  const [initialMediaIndex, setInitialMediaIndex] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null);
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [moodId, setMoodId] = useState("all");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const hoverCloseTimerRef = useRef(null);
  const filteredCheckins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return checkins.filter((checkin) => {
      const queryMatch =
        !normalizedQuery ||
        checkin.title.toLowerCase().includes(normalizedQuery) ||
        checkin.caption.toLowerCase().includes(normalizedQuery) ||
        checkin.locationName.toLowerCase().includes(normalizedQuery) ||
        checkin.city.toLowerCase().includes(normalizedQuery);
      const categoryMatch = categoryId === "all" || checkin.categoryId === categoryId;
      const moodMatch = moodId === "all" || checkin.moodId === moodId;

      return queryMatch && categoryMatch && moodMatch;
    });
  }, [categoryId, moodId, query]);

  useEffect(() => {
    if (activeId && !filteredCheckins.some((checkin) => checkin.id === activeId)) {
      setActiveId(null);
    }
  }, [activeId, filteredCheckins]);

  const activeCheckin = activeId
    ? filteredCheckins.find((checkin) => checkin.id === activeId) ?? null
    : null;

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

  function openMemory(checkinId, mediaIndex = null) {
    keepPreviewOpen();
    setActiveId(checkinId);
    setInitialMediaIndex(mediaIndex);
    setHoveredPreviewId(null);
    setDrawerMode("memory");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setHoveredPreviewId(null);
    setInitialMediaIndex(null);

    if (drawerMode === "memory") {
      setActiveId(null);
    }
  }

  return (
    <section className="map-workspace">
      <div className="map-body">
        <Link href="/checkins" className="explory-back-button" aria-label="Quay lại danh sách">
          <span aria-hidden="true">‹</span>
        </Link>

        <MapSearchPanel
          categoryId={categoryId}
          isInfoOpen={isInfoOpen}
          moodId={moodId}
          query={query}
          resultCount={filteredCheckins.length}
          onAddMemory={() => {
            setActiveId(null);
            setDrawerMode("add");
          }}
          onCategoryChange={setCategoryId}
          onMoodChange={setMoodId}
          onQueryChange={setQuery}
          onToggleInfo={() => setIsInfoOpen((value) => !value)}
        />

        <div className="leaflet-map-shell">
          {filteredCheckins.length > 0 ? (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={6}
              minZoom={4}
              maxZoom={18}
              attributionControl={false}
              zoomControl={false}
              scrollWheelZoom
              className="checkin-leaflet-map"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FitBounds visibleCheckins={filteredCheckins} />
              <MapControls
                activeCheckin={activeCheckin}
                visibleCheckins={filteredCheckins}
                onAddMemory={() => {
                  setActiveId(null);
                  setDrawerMode("add");
                }}
              />

              {filteredCheckins.map((checkin) => {
                const isActive =
                  (drawerMode === "memory" && checkin.id === activeId) ||
                  checkin.id === hoveredPreviewId;

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
                          onPress={(mediaIndex) => openMemory(checkin.id, mediaIndex)}
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
            initialMediaIndex={initialMediaIndex}
            onClose={closeDrawer}
          />
        ) : null}
      </div>
    </section>
  );
}

function MapSearchPanel({
  categoryId,
  isInfoOpen,
  moodId,
  onAddMemory,
  onCategoryChange,
  onMoodChange,
  onQueryChange,
  onToggleInfo,
  query,
  resultCount
}) {
  const boundsSummary = getBoundsSummary(checkins);

  return (
    <div className="explory-map-info" aria-label="Tìm kiếm kỷ niệm trên bản đồ">
      <div className="explory-searchbar">
        <label className="explory-search-field">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm kỷ niệm hoặc địa điểm"
          />
        </label>
        <button
          className="explory-info-toggle"
          type="button"
          aria-expanded={isInfoOpen}
          aria-label="Mở bộ lọc"
          onClick={onToggleInfo}
        >
          <span aria-hidden="true">{isInfoOpen ? "×" : "☰"}</span>
        </button>
      </div>

      <div className="explory-found-pill">
        <span aria-hidden="true" />
        {resultCount} kỷ niệm đang hiển thị
      </div>

      <div className={isInfoOpen ? "explory-info-detail open" : "explory-info-detail"}>
        <div className="explory-filter-grid">
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

        <div className="explory-range-panel">
          <div className="explory-range-title">
            <span className="range-location-icon" aria-hidden="true" />
            Vùng kỷ niệm
          </div>
          <div className="explory-range-grid">
            <div className="explory-coordinate-card">
              <span className="coordinate-card-title">
                <span aria-hidden="true" />
                Tây nam
              </span>
              <span className="coordinate-line">
                Lat <strong>{boundsSummary.southwest.lat}</strong>
              </span>
              <span className="coordinate-line">
                Lng <strong>{boundsSummary.southwest.lng}</strong>
              </span>
            </div>
            <div className="explory-coordinate-card">
              <span className="coordinate-card-title">
                <span className="northeast" aria-hidden="true" />
                Đông bắc
              </span>
              <span className="coordinate-line">
                Lat <strong>{boundsSummary.northeast.lat}</strong>
              </span>
              <span className="coordinate-line">
                Lng <strong>{boundsSummary.northeast.lng}</strong>
              </span>
            </div>
          </div>
          <button className="btn btn-primary explory-add-inline" type="button" onClick={onAddMemory}>
            <span aria-hidden="true">+</span>
            Thêm kỷ niệm
          </button>
        </div>
      </div>
    </div>
  );
}

function getBoundsSummary(items) {
  const latitudes = items.map((item) => item.latitude);
  const longitudes = items.map((item) => item.longitude);

  return {
    northeast: {
      lat: Math.max(...latitudes).toFixed(3),
      lng: Math.max(...longitudes).toFixed(3)
    },
    southwest: {
      lat: Math.min(...latitudes).toFixed(3),
      lng: Math.min(...longitudes).toFixed(3)
    }
  };
}

function MapDrawerOverlay({ activeCheckin, drawerMode, initialMediaIndex, onClose }) {
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
  const drawerProps = isAddDrawer
    ? mergeProps(overlayProps, dialogProps, modalProps)
    : mergeProps(overlayProps, dialogProps);

  usePreventScroll({ isDisabled: !isAddDrawer });

  return (
    <FocusScope autoFocus={isAddDrawer} contain={isAddDrawer} restoreFocus>
      {isAddDrawer ? (
        <div
          {...underlayProps}
          className="drawer-backdrop"
          role="presentation"
        />
      ) : null}
      <aside
        {...drawerProps}
        ref={drawerRef}
        className={isAddDrawer ? "map-drawer add-drawer" : "map-drawer memory-drawer"}
      >
        <span className="drawer-handle" aria-hidden="true" />
        <div className={isAddDrawer ? "drawer-head" : "drawer-head memory-drawer-head"}>
          {isAddDrawer ? (
            <div>
              <p className="eyebrow">Thêm mới</p>
              <h2 {...titleProps} ref={titleRef}>
                {title}
              </h2>
            </div>
          ) : (
            <h2 {...titleProps} ref={titleRef} className="sr-only">
              {title}
            </h2>
          )}
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
          <MemoryDrawerContent checkin={activeCheckin} initialMediaIndex={initialMediaIndex} />
        ) : null}
      </aside>
    </FocusScope>
  );
}

function MemoryDrawerContent({ checkin, initialMediaIndex }) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const visibleMedia = media.slice(0, 4);
  const remainingCount = Math.max(media.length - visibleMedia.length, 0);
  const [viewerIndex, setViewerIndex] = useState(() =>
    Number.isInteger(initialMediaIndex) ? initialMediaIndex : null
  );

  function openMedia(index) {
    setViewerIndex(index);
  }

  return (
    <article className="drawer-memory">
      <button
        className="google-place-hero media-open-button"
        type="button"
        aria-label={`Mở ảnh ${checkin.title}`}
        onClick={() => openMedia(0)}
      >
        <img src={getCoverImage(checkin)} alt={checkin.title} />
      </button>

      <div className="google-place-summary">
        <h2>{checkin.title}</h2>
        <p className="google-place-rating">
          <strong>{mediaSummary.total}</strong>
          <span aria-hidden="true"> ★★★★★ </span>
          <em>{mediaSummary.photos} ảnh{mediaSummary.videos ? `, ${mediaSummary.videos} video` : ""}</em>
        </p>
        <p>{category.name} · {mood.name}</p>
      </div>

      <div className="google-place-actions" aria-label="Thao tác kỷ niệm">
        <Link href={`/checkins/${checkin.id}`}>
          <span aria-hidden="true">↗</span>
          <small>Chi tiết</small>
        </Link>
        <button type="button">
          <span aria-hidden="true">♡</span>
          <small>Lưu</small>
        </button>
        <button type="button">
          <span aria-hidden="true">⇄</span>
          <small>Chia sẻ</small>
        </button>
      </div>

      <p className="journal-text">{checkin.caption}</p>

      <dl className="google-place-facts drawer-meta">
        <div>
          <span aria-hidden="true">⌖</span>
          <dt>Địa điểm</dt>
          <dd>{checkin.locationName}</dd>
        </div>
        <div>
          <span aria-hidden="true">◷</span>
          <dt>Ngày kỷ niệm</dt>
          <dd>{formatDate(checkin.checkinTime)}</dd>
        </div>
        <div>
          <span aria-hidden="true">●</span>
          <dt>Người thêm</dt>
          <dd>{checkin.createdBy}</dd>
        </div>
      </dl>

      <div className="google-place-media" aria-label="Ảnh và video trong kỷ niệm">
        {visibleMedia.map((item, index) => (
          <button
            className="memory-preview-tile media-open-button"
            key={item.id}
            type="button"
            aria-label={`Mở ${item.type === "video" ? "video" : "ảnh"} ${index + 1}`}
            onClick={() => openMedia(index)}
          >
            <MediaPreview item={item} alt={item.alt ?? ""} />
            {item.type === "video" ? <i aria-label="Video" /> : null}
          </button>
        ))}
        {remainingCount > 0 ? (
          <button
            className="memory-preview-more media-open-button"
            type="button"
            aria-label="Mở thêm media"
            onClick={() => openMedia(visibleMedia.length)}
          >
            <strong>+{remainingCount}</strong>
            <small>More</small>
          </button>
        ) : null}
      </div>

      {viewerIndex !== null ? (
        <MemoryMediaViewer
          activeIndex={viewerIndex}
          checkin={checkin}
          media={media}
          onClose={() => setViewerIndex(null)}
          onSelect={setViewerIndex}
        />
      ) : null}
    </article>
  );
}

function MemoryMediaViewer({ activeIndex, checkin, media, onClose, onSelect }) {
  const activeItem = media[activeIndex] ?? media[0];
  const [mainSwiper, setMainSwiper] = useState(null);

  usePreventScroll();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (mainSwiper && mainSwiper.activeIndex !== activeIndex) {
      mainSwiper.slideTo(activeIndex);
    }
  }, [activeIndex, mainSwiper]);

  function move(direction) {
    onSelect((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return media.length - 1;
      }

      if (nextIndex >= media.length) {
        return 0;
      }

      return nextIndex;
    });
  }

  const viewer = (
    <div className="memory-media-viewer" role="dialog" aria-modal="true" aria-label="Xem ảnh và video">
      <nav className="media-viewer-mini-nav" aria-label="Điều hướng media">
        <button type="button" aria-label="Menu">
          ☰
        </button>
        <span>
          <i aria-hidden="true">▯</i>
          Saved
        </span>
        <span>
          <i aria-hidden="true">◷</i>
          Recents
        </span>
        <span className="active">
          <i aria-hidden="true">▣</i>
          Media
        </span>
      </nav>

      <aside className="media-viewer-rail" aria-label="Danh sách media">
        <div className="media-viewer-search">
          <button type="button" aria-label="Đóng trình xem" onClick={onClose}>
            ←
          </button>
          <label>
            <span>{checkin.title}</span>
            <i aria-hidden="true">⌕</i>
          </label>
        </div>
        <div className="media-viewer-tabs" aria-label="Bộ lọc media">
          <span className="active">Tất cả</span>
          <span>Mới nhất</span>
          <span>Video</span>
          <span>Đã lưu</span>
        </div>
        <Swiper
          className="media-viewer-thumbs"
          direction="vertical"
          freeMode
          modules={[FreeMode]}
          slidesPerView="auto"
          spaceBetween={0}
          watchSlidesProgress
          breakpoints={{
            0: {
              direction: "horizontal",
              spaceBetween: 6
            },
            821: {
              direction: "vertical",
              spaceBetween: 0
            }
          }}
        >
          {media.map((item, index) => (
            <SwiperSlide className="media-viewer-thumb-slide" key={item.id}>
              <button
                className={index === activeIndex ? "active" : ""}
                type="button"
                aria-label={`Chọn ${item.type === "video" ? "video" : "ảnh"} ${index + 1}`}
                onClick={() => onSelect(index)}
              >
                <MediaPreview item={item} alt={item.alt ?? ""} />
                {item.type === "video" ? <i>Video</i> : null}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </aside>

      <section className="media-viewer-stage">
        <div className="media-viewer-topcard">
          <strong>{checkin.title}</strong>
          <span>{checkin.createdBy} · {formatDate(checkin.checkinTime)}</span>
          <small>{activeItem?.type === "video" ? "Video" : "Photo"} · {activeIndex + 1}/{media.length}</small>
        </div>

        <div className="media-viewer-actions">
          <button type="button">
            <span aria-hidden="true">↗</span>
            Chia sẻ
          </button>
          <button type="button" aria-label="Đóng" onClick={onClose}>
            ×
          </button>
        </div>

        {media.length > 1 ? (
          <>
            <button
              className="media-viewer-nav prev"
              type="button"
              aria-label="Media trước"
              onClick={() => move(-1)}
            >
              ‹
            </button>
            <button
              className="media-viewer-nav next"
              type="button"
              aria-label="Media tiếp theo"
              onClick={() => move(1)}
            >
              ›
            </button>
          </>
        ) : null}

        <Swiper
          className="media-viewer-main"
          initialSlide={activeIndex}
          keyboard={{ enabled: true }}
          modules={[Keyboard]}
          slidesPerView={1}
          onSlideChange={(swiper) => onSelect(swiper.activeIndex)}
          onSwiper={setMainSwiper}
        >
          {media.map((item) => (
            <SwiperSlide className="media-viewer-slide" key={item.id}>
              {item.type === "video" ? (
                <video key={item.id} controls preload="metadata" src={item.url} />
              ) : (
                <img key={item.id} src={item.url} alt={item.alt ?? checkin.title} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );

  return createPortal(viewer, document.body);
}

function MediaPreview({ item, alt, className }) {
  if (item?.type === "video") {
    return (
      <video
        aria-hidden="true"
        className={className}
        muted
        playsInline
        preload="metadata"
        src={item.url}
      />
    );
  }

  return <img className={className} src={item?.url} alt={alt} />;
}

function MemoryMediaPreview({ checkin, onMouseEnter, onMouseLeave, onPress, variant }) {
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const visibleMedia = media.slice(0, variant === "drawer" ? 8 : 6);
  const remainingCount = Math.max(media.length - visibleMedia.length, 0);
  const isHoverPreview = variant === "hover";
  const category = getCategory(checkin.categoryId);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = media[activeSlideIndex] ?? media[0];

  function moveSlide(event, direction) {
    event.preventDefault();
    event.stopPropagation();
    setActiveSlideIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return media.length - 1;
      }

      if (nextIndex >= media.length) {
        return 0;
      }

      return nextIndex;
    });
  }

  const preview = isHoverPreview ? (
    <article
      className="memory-place-card hover"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Xem chi tiết ${checkin.title}`}
    >
      <div className="memory-place-slider">
        <MediaPreview
          className="memory-place-card-photo"
          item={activeSlide}
          alt={activeSlide?.alt ?? checkin.title}
        />
        <div className="memory-place-scrim" aria-hidden="true" />

        {activeSlide?.type === "video" ? (
          <span className="memory-place-play" aria-label="Video">
            <span aria-hidden="true" />
          </span>
        ) : null}

        {media.length > 1 ? (
          <>
            <button
              className="memory-slide-button prev"
              type="button"
              aria-label="Media trước"
              onClick={(event) => moveSlide(event, -1)}
            >
              ‹
            </button>
            <button
              className="memory-slide-button next"
              type="button"
              aria-label="Media tiếp theo"
              onClick={(event) => moveSlide(event, 1)}
            >
              ›
            </button>
          </>
        ) : null}

        <div className="memory-place-overlay">
          <div>
            <h3>{checkin.title}</h3>
            <p>{checkin.locationName}</p>
          </div>
          <span className="memory-place-badge">
            {activeSlide?.type === "video" ? "Video" : "Ảnh"}
          </span>
        </div>

        {media.length > 1 ? (
          <div className="memory-slide-progress" aria-label={`${activeSlideIndex + 1} / ${media.length}`}>
            {media.map((item, index) => (
              <span
                className={index === activeSlideIndex ? "active" : ""}
                key={item.id}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="memory-place-footer">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPress?.();
          }}
        >
          Xem chi tiết
        </button>
        <span>
          {mediaSummary.photos} ảnh{mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""}
        </span>
      </div>
    </article>
  ) : (
    <article
      className={`memory-media-preview ${variant}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="memory-preview-head">
        <div>
          <p>{mediaSummary.total} media</p>
          <h3>{checkin.title}</h3>
        </div>
      </div>

      <div className="memory-preview-grid" aria-label="Ảnh và video trong kỷ niệm">
        {visibleMedia.map((item) => (
          <span className="memory-preview-tile" key={item.id}>
            <MediaPreview item={item} alt={item.alt ?? ""} />
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
    return (
      <Pressable
        onPress={() => onPress(activeSlide?.type === "video" ? activeSlideIndex : null)}
      >
        {preview}
      </Pressable>
    );
  }

  return preview;
}
