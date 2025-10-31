// utils/embed.ts
export type EmbedSizePreset = "responsive-16-9" | "responsive-4-3" | "fixed-640x480" | "fixed-800x600";

export interface EmbedOptions {
  size: EmbedSizePreset;
  theme?: "light" | "dark" | "auto";
  hideBrand?: boolean;
  toolbar?: "full" | "minimal" | "none";
}

export const buildEmbedSrc = (shareUrl: string, opts: EmbedOptions) => {
  if (!shareUrl) return "";
  const url = new URL(shareUrl);
  // 例: /shared-map/{uuid} → /shared-map/embed/{uuid} に差し替え
  url.pathname = url.pathname.replace("/shared-map/", "/shared-map/embed/");
  url.searchParams.set("src", "embed");
  url.searchParams.set("utm_source", "embed");
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_campaign", "shared_map");

  if (opts.theme) url.searchParams.set("theme", opts.theme);
  if (opts.hideBrand) url.searchParams.set("hide_brand", "1");
  if (opts.toolbar) url.searchParams.set("toolbar", opts.toolbar);

  return url.toString();
};

export const buildIframeSnippet = (embedSrc: string, size: EmbedSizePreset) => {
  if (!embedSrc) return "";
  const baseAttrs = `src="${embedSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-popups" style="border:0;width:100%;height:100%;"`;

  if (size.startsWith("responsive")) {
    const aspect = size === "responsive-4-3" ? "75%" : "56.25%"; // 4:3 or 16:9
    return [
      `<div style="position:relative;padding-bottom:${aspect};height:0;overflow:hidden;">`,
      `  <iframe ${baseAttrs} allowfullscreen></iframe>`,
      `</div>`
    ].join("\n");
  }

  // fixed sizes
  const [w, h] = size === "fixed-800x600" ? [800, 600] : [640, 480];
  return `<iframe ${baseAttrs} width="${w}" height="${h}" allowfullscreen></iframe>`;
};
