import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, MapPin } from 'lucide-react';
import { CustomPlace, PLACE_TYPE_CHOICES } from '../../types/customPlace';
import CloseButton from '../CloseButton/CloseButton';
import BottomSheetHandle from '../BottomSheetHandle/BottomSheetHandle';
import { useIsMobile } from '../../hooks/useMediaQuery';

type SheetHeight = 'medium' | 'full';

interface CustomPlaceDetailPanelProps {
  customPlace: CustomPlace | null;
  onClose: () => void;
  onEdit?: (customPlace: CustomPlace) => void;
  onDelete?: (customPlace: CustomPlace) => void;
}

const CustomPlaceDetailPanel: React.FC<CustomPlaceDetailPanelProps> = ({
  customPlace,
  onClose,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>('medium');
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset to medium when customPlace changes
  useEffect(() => {
    if (customPlace) {
      setSheetHeight('medium');
    }
  }, [customPlace]);

  // Handle bar tap handler
  const handleHandleBarClick = () => {
    if (!isMobile) return;

    if (sheetHeight === 'medium') {
      setSheetHeight('full');
    } else {
      setSheetHeight('medium');
    }
  };

  // 種別のアイコンを取得
  const getPlaceTypeIcon = (placeType: string | null | undefined) => {
    const icons: Record<string, string> = {
      photo_spot: '📷',
      meeting_point: '🤝',
      viewpoint: '🌅',
      memorial: '🗿',
      other: '📍',
    };
    return placeType ? icons[placeType] || '📍' : '📍';
  };

  // 種別の表示名を取得
  const getPlaceTypeLabel = (placeType: string | null | undefined) => {
    if (!placeType) return 'その他';
    const choice = PLACE_TYPE_CHOICES.find((c) => c.value === placeType);
    return choice ? choice.label : 'その他';
  };

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!customPlace) return null;

  return (
    <>
      {/* Overlay (Mobile only) */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed z-50 bg-white shadow-xl overflow-y-auto
          ${
            isMobile
              ? `left-0 right-0 bottom-0 rounded-t-3xl transition-all duration-300 ${
                  sheetHeight === 'full' ? 'top-20' : 'top-[40vh]'
                }`
              : 'top-16 left-0 h-[calc(100vh-4rem)] w-[400px] transform transition-transform duration-300'
          }
        `}
      >
        {/* Bottom Sheet Handle (Mobile) */}
        {isMobile && (
          <BottomSheetHandle onClick={handleHandleBarClick} />
        )}

        {/* Close Button (Desktop) */}
        {!isMobile && <CloseButton onClick={onClose} />}

        {/* Content */}
        <div className="p-6 pt-8 md:pt-16">
          {/* 画像 */}
          {customPlace.image_url ? (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={customPlace.image_url}
                alt={customPlace.name}
                className="w-full h-64 object-cover"
              />
            </div>
          ) : (
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-64">
              <div className="text-6xl">{getPlaceTypeIcon(customPlace.place_type)}</div>
            </div>
          )}

          {/* 地点名 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            {customPlace.name}
          </h2>

          {/* 種別 */}
          {customPlace.place_type && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">種別:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span>{getPlaceTypeIcon(customPlace.place_type)}</span>
                <span>{getPlaceTypeLabel(customPlace.place_type)}</span>
              </span>
            </div>
          )}

          {/* メモ */}
          {customPlace.memo && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                📝 メモ
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {customPlace.memo}
              </p>
            </div>
          )}

          {/* 位置情報 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              📍 位置情報
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg space-y-1">
              <p className="text-sm text-gray-600">
                緯度: <span className="font-mono">{customPlace.latitude.toFixed(6)}</span>
              </p>
              <p className="text-sm text-gray-600">
                経度: <span className="font-mono">{customPlace.longitude.toFixed(6)}</span>
              </p>
            </div>
          </div>

          {/* 登録日 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              📅 登録日
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {formatDate(customPlace.created_at)}
            </p>
          </div>

          {/* 所有者 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              👤 登録者
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {customPlace.owner.name}
            </p>
          </div>

          {/* 関連マップ */}
          {customPlace.maps && customPlace.maps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                🗺️ 関連マップ
              </h3>
              <div className="space-y-2">
                {customPlace.maps.map((map) => (
                  <div
                    key={map.id}
                    className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{map.name}</span>
                    {map.is_visible && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        表示中
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => onEdit(customPlace)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>編集</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(customPlace)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>削除</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomPlaceDetailPanel;
