import { MapSection } from "@/components/map-section";

import styles from "@/components/map.module.css";
import { createCx } from "@/lib/styles";

const cx = createCx(styles);

export default function HomePage() {
  return (
    <div className={cx("overview-map-page")}>
      <MapSection />
    </div>
  );
}
