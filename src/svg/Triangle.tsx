import React from "react";
import {FOREGROUND_COLOR} from "../util/util";

export default function Triangle({width = 64}: Readonly<{width?: number}>): JSX.Element {
  return (
    <div style={{position: "relative"}}>
      <svg width={width} height={width} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 64L4.28719 16L59.7128 16L32 64Z" fill={FOREGROUND_COLOR} />
      </svg>
    </div>
  );
}
