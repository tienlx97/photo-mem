"use client";

import { Button } from "react-aria-components";

export function DetailActions() {
  return (
    <div className="detail-actions">
      <Button className="btn btn-primary" type="button">
        <span aria-hidden="true">✎</span>
        Chỉnh sửa
      </Button>
      <Button className="btn btn-secondary" type="button">
        <span aria-hidden="true">⌁</span>
        Chỉ đường
      </Button>
    </div>
  );
}
