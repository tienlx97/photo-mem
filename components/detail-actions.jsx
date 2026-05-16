"use client";

import { Button } from "react-aria-components";

import detailStyles from "../app/checkins/[id]/detail.module.css";
import uiStyles from "./ui.module.css";
import { createCx } from "@/lib/styles";

const cx = createCx(uiStyles, detailStyles);

export function DetailActions() {
  return (
    <div className={cx("detail-actions")}>
      <Button className={cx("btn btn-primary")} type="button">
        <span aria-hidden="true">✎</span>
        Chỉnh sửa
      </Button>
      <Button className={cx("btn btn-secondary")} type="button">
        <span aria-hidden="true">⌁</span>
        Chỉ đường
      </Button>
    </div>
  );
}
