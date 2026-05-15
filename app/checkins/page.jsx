import { CheckinFilters } from "@/components/checkin-filters";
import { PageHeader, PrimaryLink } from "@/components/ui";

export default function CheckinsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Danh sách kỷ niệm"
        title="Tìm lại theo ngày, nơi chốn và cảm xúc."
        description="Tất cả kỷ niệm của hai người nằm trong cùng một danh sách, không có feed công khai."
        action={<PrimaryLink href="/checkins/new">Thêm kỷ niệm</PrimaryLink>}
      />
      <CheckinFilters />
    </div>
  );
}
