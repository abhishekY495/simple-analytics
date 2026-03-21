import { MapMarker } from "@/components/ui/dotted-map";
import { LiveVisitorMarker } from "@/types/analytics";

export const LiveVisitorMarkerOverlay = ({
  marker,
  x,
  y,
  r,
}: {
  marker: MapMarker<LiveVisitorMarker>;
  x: number;
  y: number;
  r: number;
}) => {
  const { countryCode, label } = marker.overlay;

  const flagW = r * 2.5;
  const flagH = flagW * 0.6;

  const fontSize = r * 1.1;
  const pillH = r * 1.65;
  const pillW = label.length * (fontSize * 0.6);
  const pillX = x + flagW / 2 + r * 0.6;
  const pillY = y - pillH / 2.2;

  return (
    <g style={{ pointerEvents: "none" }}>
      <image
        href={`https://flagicons.lipis.dev/flags/4x3/${countryCode}.svg`}
        x={x - flagW / 2}
        y={y - flagH / 2}
        width={flagW}
        height={flagH}
        preserveAspectRatio="xMidYMid meet"
      />
      <rect
        x={pillX}
        y={pillY}
        width={pillW}
        height={pillH}
        rx={0.5}
        fill="rgba(0,0,0,0.55)"
      />
      <text
        x={pillX + r * 0.7}
        y={y + fontSize * 0.35}
        fontSize={fontSize}
        fill="white"
      >
        {label}
      </text>
    </g>
  );
};
