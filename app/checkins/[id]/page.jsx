import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckinCard } from "@/components/checkin-card";
import { DetailActions } from "@/components/detail-actions";
import { PageHeader, SecondaryLink } from "@/components/ui";
import {
  checkins,
  formatDate,
  getCategory,
  getMemoryMedia,
  getMediaSummary,
  getMood
} from "@/lib/mock-data";

export default function CheckinDetailPage({ params }) {
  const checkin = checkins.find((item) => item.id === params.id);

  if (!checkin) {
    notFound();
  }

  const category = getCategory(checkin.categoryId);
  const mood = getMood(checkin.moodId);
  const media = getMemoryMedia(checkin);
  const mediaSummary = getMediaSummary(checkin);
  const related = checkins.filter((item) => item.id !== checkin.id).slice(0, 2);

  return (
    <div className="page-stack article-stack">
      <PageHeader
        eyebrow="Bài viết kỷ niệm"
        title={checkin.title}
        description={`${mediaSummary.photos} ảnh${mediaSummary.videos ? ` · ${mediaSummary.videos} video` : ""} · ${checkin.locationName} · ${formatDate(checkin.checkinTime)}`}
        action={
          <SecondaryLink href="/">
            <span aria-hidden="true">←</span>
            Bản đồ
          </SecondaryLink>
        }
      />

      <article className="memory-article">
        <section className="article-media" aria-label="Ảnh và video của kỷ niệm">
          {media.map((item, index) => (
            <figure className={index === 0 ? "article-media-item featured" : "article-media-item"} key={item.id}>
              {item.type === "video" ? (
                <video controls preload="metadata">
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt || checkin.title}
                  fill
                  sizes={index === 0 ? "(max-width: 820px) 100vw, 720px" : "(max-width: 820px) 50vw, 360px"}
                />
              )}
              {item.type === "video" ? <figcaption>Video</figcaption> : null}
            </figure>
          ))}
        </section>

        <section className="article-content">
          <div className="article-prose">
            <div className="tag-row">
              <span className="pill" style={{ "--pill-color": category.color }}>
                {category.icon} · {category.name}
              </span>
              <span className="pill muted">{mood.icon} · {mood.name}</span>
              <span className="pill muted">Chỉ hai người</span>
            </div>

            <p className="article-lead">{checkin.caption}</p>
            <p>
              Đây là phần bài viết dài hơn cho kỷ niệm. Khi backend sẵn sàng, nội dung này có thể
              lấy từ trường `note` hoặc `articleBody`, cho phép lưu lại câu chuyện đầy đủ sau mỗi
              chuyến đi, buổi hẹn hoặc một khoảnh khắc nhỏ đáng nhớ.
            </p>
          </div>

          <aside className="article-aside">
            <dl className="meta-list">
              <div>
                <dt>Địa điểm</dt>
                <dd>{checkin.locationName}</dd>
              </div>
              <div>
                <dt>Địa chỉ</dt>
                <dd>{checkin.address}</dd>
              </div>
              <div>
                <dt>Ngày kỷ niệm</dt>
                <dd>{formatDate(checkin.checkinTime)}</dd>
              </div>
              <div>
                <dt>Người thêm</dt>
                <dd>{checkin.createdBy}</dd>
              </div>
              <div>
                <dt>Media</dt>
                <dd>{mediaSummary.photos} ảnh{mediaSummary.videos ? `, ${mediaSummary.videos} video` : ""}</dd>
              </div>
            </dl>

            <div className="mini-map">
              <span
                style={
                  {
                    left: `${checkin.mapPosition.x}%`,
                    top: `${checkin.mapPosition.y}%`,
                    "--marker-color": category.color
                  }
                }
              />
            </div>

            <DetailActions />
          </aside>
        </section>
      </article>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gợi ý</p>
            <h2>Kỷ niệm khác</h2>
          </div>
        </div>
        <div className="checkin-grid two">
          {related.map((item) => (
            <CheckinCard checkin={item} key={item.id} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
