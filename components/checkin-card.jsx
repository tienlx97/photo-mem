import Link from "next/link";
import { formatDate, getCategory, getCoverImage, getMediaSummary, getMood } from "@/lib/mock-data";

export function CheckinCard({ checkin, compact = false }) {
  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const coverImage = getCoverImage(checkin);
  const mediaSummary = getMediaSummary(checkin);

  return (
    <article className={compact ? "checkin-card compact" : "checkin-card"}>
      <Link href={`/checkins/${checkin.id}`} className="checkin-image-link" aria-label={checkin.title}>
        <img src={coverImage} alt={checkin.title} />
        <span className="media-count">
          {mediaSummary.photos} ảnh{mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""}
        </span>
      </Link>
      <div className="checkin-card-body">
        <div className="tag-row">
          <span className="pill" style={{ "--pill-color": category.color }}>
            {category.icon} · {category.name}
          </span>
          <span className="pill muted">{mood.icon} · {mood.name}</span>
        </div>
        <Link href={`/checkins/${checkin.id}`} className="card-title">
          {checkin.title}
        </Link>
        <p>{checkin.caption}</p>
        <div className="card-meta">
          <span>{checkin.locationName}</span>
          <span>{formatDate(checkin.checkinTime)}</span>
          <span>{checkin.createdBy} thêm</span>
        </div>
      </div>
    </article>
  );
}
