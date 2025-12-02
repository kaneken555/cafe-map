import { useState } from 'react';
import { Plus, X, Map, MapPin } from 'lucide-react';

interface AddActionFABProps {
  onCreateMap: () => void;
  onAddCustomPlace: () => void;
  isMapSelected: boolean;
}

export const AddActionFAB: React.FC<AddActionFABProps> = ({
  onCreateMap,
  onAddCustomPlace,
  isMapSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateMap = () => {
    setIsOpen(false);
    onCreateMap();
  };

  const handleAddCustomPlace = () => {
    setIsOpen(false);
    onAddCustomPlace();
  };

  // メニュー外をクリックしたら閉じる
  const handleBackdropClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* バックドロップ（メニュー外クリック検知用） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-[136px] md:bottom-6 right-6 md:right-24 z-50 flex flex-col items-end gap-3">
        {/* メニュー項目 */}
        {isOpen && (
          <div
            className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50"
            role="menu"
            aria-label="追加アクションメニュー"
          >
            <button
              onClick={handleCreateMap}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all hover:-translate-x-1 whitespace-nowrap cursor-pointer z-50"
              role="menuitem"
              aria-label="新しいマップを作成"
            >
              <Map className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">
                新しいマップを作成
              </span>
            </button>

            <button
              onClick={handleAddCustomPlace}
              disabled={!isMapSelected}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all whitespace-nowrap z-50 ${
                isMapSelected
                  ? 'bg-white hover:bg-gray-50 hover:-translate-x-1 cursor-pointer'
                  : 'bg-gray-100 cursor-not-allowed opacity-60'
              }`}
              role="menuitem"
              aria-label="カスタム地点を登録"
              aria-disabled={!isMapSelected}
            >
              <MapPin className={`w-5 h-5 ${isMapSelected ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${isMapSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                カスタム地点を登録
              </span>
            </button>
          </div>
        )}

        {/* メインFAB */}
        <button
          onClick={handleToggle}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 cursor-pointer z-50 ${
            isOpen
              ? 'bg-gray-600 focus:ring-gray-300'
              : 'bg-[#FFC800] focus:ring-yellow-300'
          }`}
          aria-label={isOpen ? 'メニューを閉じる' : 'アクションメニューを開く'}
          aria-expanded={isOpen}
          aria-controls="add-action-menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </>
  );
};
