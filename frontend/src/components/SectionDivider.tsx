import React from "react";

const SectionDivider: React.FC<{
  flip?: boolean;
  color?: string;
  darkColor?: string;
}> = ({ flip = false, color = "#f0f4f8", darkColor = "#18181b" }) => (
  <div className="w-full overflow-hidden leading-none" aria-hidden="true">
    <svg
      viewBox="0 0 1440 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-12 ${flip ? "rotate-180" : ""}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0,80 C360,0 1080,160 1440,80 L1440,0 L0,0 Z"
        className="fill-[var(--divider-color)] dark:fill-[var(--divider-dark-color)]"
        style={
          {
            "--divider-color": color,
            "--divider-dark-color": darkColor,
          } as React.CSSProperties
        }
      />
    </svg>
  </div>
);

export default SectionDivider;
