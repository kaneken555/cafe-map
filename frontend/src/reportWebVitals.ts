import type { Metric, ReportOpts } from 'web-vitals';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry); // `onINP` は新しい指標（応答性）
  }
};

export default reportWebVitals;
