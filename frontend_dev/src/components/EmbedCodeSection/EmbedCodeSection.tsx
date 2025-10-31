// components/EmbedCodeSection/EmbedCodeSection.tsx
import React, { useMemo, useState } from "react";
import { buildEmbedSrc, buildIframeSnippet, EmbedOptions, EmbedSizePreset } from "../../utils/embed";

type Props = { shareUrl: string };

const EmbedCodeSection: React.FC<Props> = ({ shareUrl }) => {
  const [size, setSize] = useState<EmbedSizePreset>("responsive-16-9");
  const [theme, setTheme] = useState<EmbedOptions["theme"]>("auto");
  const [hideBrand, setHideBrand] = useState(false);
  const [toolbar, setToolbar] = useState<EmbedOptions["toolbar"]>("minimal");

  const opts: EmbedOptions = useMemo(() => ({ size, theme, hideBrand, toolbar }), [size, theme, hideBrand, toolbar]);
  const embedSrc = useMemo(() => buildEmbedSrc(shareUrl, opts), [shareUrl, opts]);
  const iframeCode = useMemo(() => buildIframeSnippet(embedSrc, size), [embedSrc, size]);

  const copy = async () => {
    await navigator.clipboard.writeText(iframeCode);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          サイズ
          <select className="ml-2 border rounded px-2 py-1"
                  value={size} onChange={(e) => setSize(e.target.value as EmbedSizePreset)}>
            <option value="responsive-16-9">レスポンシブ 16:9</option>
            <option value="responsive-4-3">レスポンシブ 4:3</option>
            <option value="fixed-640x480">固定 640×480</option>
            <option value="fixed-800x600">固定 800×600</option>
          </select>
        </label>

        <label className="text-sm">
          テーマ
          <select className="ml-2 border rounded px-2 py-1"
                  value={theme} onChange={(e) => setTheme(e.target.value as any)}>
            <option value="auto">自動</option>
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
          </select>
        </label>

        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={hideBrand} onChange={(e) => setHideBrand(e.target.checked)} />
          ブランド表示を隠す
        </label>

        <label className="text-sm">
          ツールバー
          <select className="ml-2 border rounded px-2 py-1"
                  value={toolbar} onChange={(e) => setToolbar(e.target.value as any)}>
            <option value="minimal">最小</option>
            <option value="full">フル</option>
            <option value="none">非表示</option>
          </select>
        </label>
      </div>

      <div>
        <label className="text-sm text-gray-700">埋め込みコード（iframe）</label>
        <textarea className="w-full h-40 mt-1 font-mono text-xs border rounded p-2" readOnly value={iframeCode} />
        <button onClick={copy} className="mt-2 px-3 py-1 rounded border bg-white hover:bg-gray-100">コピー</button>
      </div>
    </div>
  );
};

export default EmbedCodeSection;
