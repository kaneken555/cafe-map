import React, { useEffect, useMemo, useRef } from "react";
import { MapDisplayOptions, MapStyleKey, IconVariant } from "../../types/mapDisplay";

type LatLng = { lat: number; lng: number };

// スタイル定義（必要に応じて調整）
const STYLE_PRESETS: Record<MapStyleKey, google.maps.MapTypeStyle[] | undefined> = {
  default: undefined,
  light: [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  ],
  dark: [
    { elementType: "geometry", stylers: [{ color: "#1f2937" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#111827" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#374151" }] },
  ],
  mono: [
    { elementType: "geometry", stylers: [{ color: "#e5e7eb" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
};

interface PreviewProps {
  options: MapDisplayOptions;
  points?: LatLng[]; // プレビュー用の仮ピン
  zoom?: number;
  center?: LatLng;
  height?: number;
  showIconOverlay?: boolean; // 追加: 右上にアイコンHUDを表示（既定 true）
}

const DEFAULT_POINTS: LatLng[] = [
  { lat: 35.6594, lng: 139.7006 }, // 渋谷
  { lat: 35.6655, lng: 139.7121 }, // 表参道寄り
  { lat: 35.6618, lng: 139.7041 },
  { lat: 35.6556, lng: 139.705 },
  { lat: 35.6577, lng: 139.709 },
];

export const MapPreview: React.FC<PreviewProps> = ({
  options,
  points = DEFAULT_POINTS,
  zoom = 14,
  center = { lat: 35.6594, lng: 139.7006 },
  height = 260,
  showIconOverlay = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const trafficRef = useRef<google.maps.TrafficLayer | null>(null);
  const transitRef = useRef<google.maps.TransitLayer | null>(null);
  const bicycleRef = useRef<google.maps.BicyclingLayer | null>(null);
  const markersRef = useRef<(google.maps.Marker | google.maps.marker.AdvancedMarkerElement)[]>([]);
  const clustererRef = useRef<any>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  const styles = useMemo(() => STYLE_PRESETS[options.style], [options.style]);

  // SVG ピンを作成（色・サイズ反映）
  const buildMarkerContent = (variant: IconVariant, color: string, size: number) => {
    const px = Math.max(16, Math.min(96, size));
    if (variant === "photo" || variant === "badge" || variant === "bubble") {
      // 簡易表現（実アプリでは各バリアントのデザインを作り込む）
      return `
        <div style="
          width:${px}px;height:${px}px;border-radius:${variant === "bubble" ? "9999px" : "10px"};
          background:${color};display:flex;align-items:center;justify-content:center;
          color:white;font-size:${Math.max(10, px * 0.35)}px;font-weight:600;
          box-shadow:0 1px 3px rgba(0,0,0,0.3)">
          ${variant === "photo" ? "📷" : variant === "badge" ? "★" : "●"}
        </div>`;
    }
    // pin
    const w = px, h = px * 1.3;
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.9 0 1 4.9 1 11c0 7.5 9.1 20 11 20s11-12.5 11-20C23 4.9 18.1 0 12 0z" fill="${color}"/>
        <circle cx="12" cy="11" r="4" fill="white"/>
      </svg>`;
  };

  // 従来 Marker 用の SVG を組み立てる（pin 以外にも対応）
  const buildLegacySVG = (variant: IconVariant, color: string, size: number) => {
    const px = Math.max(16, Math.min(96, size));

    if (variant === "pin") {
      return `
        <svg width="${px}" height="${px * 1.3}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.9 0 1 4.9 1 11c0 7.5 9.1 20 11 20s11-12.5 11-20C23 4.9 18.1 0 12 0z" fill="${color}"/>
          <circle cx="12" cy="11" r="4" fill="white"/>
        </svg>`;
    }

    if (variant === "bubble") {
      return `
        <svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="${color}"/>
        </svg>`;
    }

    if (variant === "badge") {
      const fs = Math.max(10, Math.round(px * 0.45));
      return `
        <svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" rx="${Math.round(px * 0.2)}" ry="${Math.round(px * 0.2)}" width="${px}" height="${px}" fill="${color}"/>
          <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
                font-size="${fs}" font-family="sans-serif" fill="#ffffff">★</text>
        </svg>`;
    }

    const fs = Math.max(10, Math.round(px * 0.45));
    return `
      <svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="${color}"/>
        <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
              font-size="${fs}" font-family="sans-serif" fill="#ffffff">📷</text>
      </svg>`;
  };

  // オーバーレイ用の HTML（マップの上に重ねて表示）
  const overlayHTML = useMemo(() => {
    const color = options.iconColor || "#3B82F6";
    return buildMarkerContent(options.iconVariant, color, options.iconSize);
  }, [options.iconVariant, options.iconColor, options.iconSize]);

  // google maps が無い場合はダミープレビュー（SVG）を描画
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).google) return;

    const el = mapContainerRef.current;
    if (!el) return;
    el.innerHTML = ""; // リセット
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", `${height}`);
    svg.style.background =
      options.style === "dark"
        ? "#111827"
        : options.style === "light"
        ? "#f9fafb"
        : options.style === "mono"
        ? "#e5e7eb"
        : "#dbeafe";
    el.appendChild(svg);

    // 簡易の道路ライン
    for (let i = 0; i < 6; i++) {
      const rect = document.createElementNS(svg.namespaceURI, "rect");
      rect.setAttribute("x", `${10 + i * 28}`);
      rect.setAttribute("y", `10`);
      rect.setAttribute("width", "6");
      rect.setAttribute("height", `${height - 20}`);
      rect.setAttribute("fill", options.style === "dark" ? "#374151" : "#9ca3af");
      svg.appendChild(rect);
    }
    // マーカー
    points.slice(0, 5).forEach((_, i) => {
      const g = document.createElementNS(svg.namespaceURI, "g");
      g.setAttribute("transform", `translate(${40 + i * 50}, ${40 + (i % 2) * 60})`);
      const wrapper = document.createElement("div");
      wrapper.innerHTML = buildMarkerContent(options.iconVariant, options.iconColor || "#3B82F6", options.iconSize);
      const foreign = document.createElementNS(svg.namespaceURI, "foreignObject");
      foreign.setAttribute("width", `${options.iconSize}`);
      foreign.setAttribute("height", `${options.iconSize * 1.3}`);
      foreign.appendChild(wrapper);
      g.appendChild(foreign);
      svg.appendChild(g);
    });
  }, [options, height, points]);

  // 実マップ初期化
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!(window as any).google || !mapContainerRef.current) return;

    mapRef.current = new (window as any).google.maps.Map(mapContainerRef.current, {
      center,
      zoom,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      styles,
    });

    return () => {
      mapRef.current = null;
    };
    // 初期化のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スタイル更新
  useEffect(() => {
    if (!(window as any).google || !mapRef.current) return;
    mapRef.current.setOptions({ styles });
  }, [styles]);

  // レイヤー表示切替
  useEffect(() => {
    if (!(window as any).google || !mapRef.current) return;

    // ---- Traffic Layer ----
    let trafficLayer = trafficRef.current ?? new (window as any).google.maps.TrafficLayer();
    trafficRef.current = trafficLayer;
    trafficLayer.setMap(options.layers.traffic ? mapRef.current : null);

    // ---- Transit Layer ----
    let transitLayer = transitRef.current ?? new (window as any).google.maps.TransitLayer();
    transitRef.current = transitLayer;
    transitLayer.setMap(options.layers.transit ? mapRef.current : null);

    // ---- Bicycling Layer ----
    let bicycleLayer = bicycleRef.current ?? new (window as any).google.maps.BicyclingLayer();
    bicycleRef.current = bicycleLayer;
    bicycleLayer.setMap(options.layers.bicycling ? mapRef.current : null);
  }, [options.layers]);

  // マーカー/クラスタ/ヒートマップ
  useEffect(() => {
    if (!(window as any).google || !mapRef.current) return;

    // ===== 既存クリア =====
    if (clustererRef.current) {
      if (typeof clustererRef.current.clearMarkers === "function") {
        clustererRef.current.clearMarkers();
      }
      if (typeof clustererRef.current.setMap === "function") {
        clustererRef.current.setMap(null);
      }
      clustererRef.current = null;
    }

    markersRef.current.forEach((m: any) => {
      if (typeof m?.setMap === "function") {
        // google.maps.Marker
        m.setMap(null);
      } else if ("map" in m) {
        // AdvancedMarkerElement: map は関数ではなくプロパティ
        m.map = null;
      }
    });
    markersRef.current = [];

    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    const color = options.iconColor || "#3B82F6";
    const content = buildMarkerContent(options.iconVariant, color, options.iconSize);
    const canAdvanced = !!(window as any)?.google?.maps?.marker?.AdvancedMarkerElement;

    // ===== ヒートマップ優先 =====
    if (options.heatmap) {
      const g = (window as any).google as typeof google;
      if (!g?.maps?.visualization?.HeatmapLayer) {
        console.warn("[MapPreview] HeatmapLayer is not available. Did you load libraries=visualization?");
        return;
      }
      const maps = g.maps;

      // 型付きのデータ（MVCArray<LatLng>）
      const heatData = new maps.MVCArray<google.maps.LatLng>(
        points.map((p) => new maps.LatLng(p.lat, p.lng))
      );

      // ここで「非 null」なローカル変数に確定させる
      type HeatmapLayer = google.maps.visualization.HeatmapLayer;
      const heatmapLayer: HeatmapLayer =
        (heatmapRef.current as HeatmapLayer | null) ??
        (new maps.visualization.HeatmapLayer({
          data: heatData,
          dissipating: true,
          radius: Math.max(10, Math.min(60, Math.round(options.iconSize / 2))),
        }) as HeatmapLayer);

      // ref を更新（以降も正しい型で使える）
      heatmapRef.current = heatmapLayer;

      // 更新系はローカル変数に対して行う（never にならない）
      heatmapLayer.setData(heatData);
      heatmapLayer.set("radius", Math.max(10, Math.min(60, Math.round(options.iconSize / 2))));
      heatmapLayer.setMap(mapRef.current ?? null);
      return;
    }


    // ===== マーカー生成 =====
    if (canAdvanced) {
      markersRef.current = points.map(p => {
        const div = document.createElement("div");
        div.innerHTML = content;
        const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
          map: options.clustering ? null : mapRef.current,
          position: p,
          content: div.firstElementChild as HTMLElement,
        });
        return marker;
      });
    } else {
      // ★ 従来 Marker では常に SVG を使用（pin以外も含む）
      markersRef.current = points.map(p => {
        const svg = buildLegacySVG(options.iconVariant, options.iconColor || "#3B82F6", options.iconSize);
        return new (window as any).google.maps.Marker({
          position: p,
          map: options.clustering ? null : mapRef.current,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
            scaledSize: new (window as any).google.maps.Size(
              options.iconVariant === "pin" ? options.iconSize : options.iconSize,
              options.iconVariant === "pin" ? options.iconSize * 1.3 : options.iconSize
            ),
          },
        });
      });
    }

    // ===== クラスタリング =====
    const enableCluster = async () => {
      if (!options.clustering) return;
      try {
        const { MarkerClusterer } = await import("@googlemaps/markerclusterer");
        clustererRef.current = new MarkerClusterer({
          markers: markersRef.current as any,
          map: mapRef.current!,
        });
      } catch {
        // 依存がない/失敗時は非クラスタで表示
        markersRef.current.forEach((m: any) => {
          if (typeof m?.setMap === "function") m.setMap(mapRef.current);
          else if ("map" in m) m.map = mapRef.current;
        });
      }
    };
    enableCluster();
  }, [
    options.iconVariant,
    options.iconColor,
    options.iconSize,
    options.clustering,
    options.heatmap,
    options.showLabels,
    points,
  ]);

  // === ここから描画 ===
  // ラッパーを relative にして、マップを absolute ではなく通常フローに置き、
  // その上にオーバーレイ（HUD）を absolute で重ねます。
  return (
    <div className="w-full rounded-md border relative" style={{ height }}>
      {/* マップ本体 */}
      <div ref={mapContainerRef} className="w-full h-full rounded-md" />

      {/* アイコンHUD（マップの右上） */}
      {showIconOverlay && (
        <div
          className="absolute right-2 top-2 pointer-events-none"
          style={{
            zIndex: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div
            className="bg-white/90 backdrop-blur rounded-lg shadow p-2 border pointer-events-auto"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              // アイコン本体（現在設定をそのまま反映）
              dangerouslySetInnerHTML={{ __html: overlayHTML }}
              // 実寸でプレビュー（AdvancedMarker と同じサイズ感）
              style={{ lineHeight: 0 }}
            />
            <div className="text-xs text-gray-700 leading-tight pr-1">
              <div>Variant: <span className="font-semibold">{options.iconVariant}</span></div>
              <div>Color: <span className="inline-block align-middle" style={{
                width: 10, height: 10, borderRadius: 9999, background: options.iconColor || "#3B82F6",
                marginRight: 4
              }} />{options.iconColor || "#3B82F6"}</div>
              <div>Size: <span className="font-semibold">{options.iconSize}px</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
