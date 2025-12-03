/**
 * 統合ポイントオーバーレイアイコン
 *
 * カフェとカスタム地点を統一的に表示するコンポーネント
 */
import React from 'react';
import { Point, isCafePoint, isCustomPlacePoint } from '../../types/point';
import CafeOverlayIcon from '../CafeOverlayIcon/CafeOverlayIcon';
import CustomPlaceOverlayIcon from '../CustomPlaceOverlayIcon/CustomPlaceOverlayIcon';
import {
  convertCafePointToCafe,
  convertCustomPlacePointToCustomPlace,
} from '../../utils/pointConverters';

interface UnifiedPointOverlayIconProps {
  /** 統合ポイント */
  point: Point;
  /** 選択されているかどうか */
  isSelected: boolean;
  /** クリック時のコールバック */
  onClick: (point: Point) => void;
  /** ラベルを表示するかどうか */
  showLabel?: boolean;
}

/**
 * 統合ポイントオーバーレイアイコンコンポーネント
 *
 * ポイントの種類（カフェ or カスタム地点）に応じて、
 * 適切なオーバーレイアイコンコンポーネントを表示する
 *
 * @example
 * ```tsx
 * <UnifiedPointOverlayIcon
 *   point={point}
 *   isSelected={selectedPoint?.id === point.id}
 *   onClick={handlePointClick}
 * />
 * ```
 */
const UnifiedPointOverlayIcon: React.FC<UnifiedPointOverlayIconProps> = ({
  point,
  isSelected,
  onClick,
  showLabel = true,
}) => {
  // カフェポイントの場合
  if (isCafePoint(point)) {
    const cafe = convertCafePointToCafe(point);

    return (
      <CafeOverlayIcon
        cafe={cafe}
        isSelected={isSelected}
        onClick={() => onClick(point)}
        showLabel={showLabel}
      />
    );
  }

  // カスタム地点ポイントの場合
  if (isCustomPlacePoint(point)) {
    const customPlace = convertCustomPlacePointToCustomPlace(point);

    return (
      <CustomPlaceOverlayIcon
        place={customPlace}
        isSelected={isSelected}
        onClick={() => onClick(point)}
        showLabel={showLabel}
      />
    );
  }

  // 未知の型の場合は何も表示しない
  console.warn('Unknown point type:', point);
  return null;
};

export default UnifiedPointOverlayIcon;
