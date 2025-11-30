import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CreateCustomPlaceRequest, PLACE_TYPE_CHOICES, PlaceType } from '../types/customPlace';
import { createCustomPlace } from '../services/customPlaceService';
import { MapItem } from '../types/map';

interface CustomPlaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialLocation?: { lat: number; lng: number };
  availableMaps?: MapItem[];
  defaultMapId?: number;
}

export const CustomPlaceFormModal: React.FC<CustomPlaceFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialLocation,
  availableMaps = [],
  defaultMapId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: initialLocation?.lat?.toString() || '',
    longitude: initialLocation?.lng?.toString() || '',
    image: null as File | null,
    place_type: undefined as PlaceType | undefined,
    memo: '',
    map_ids: defaultMapId ? [defaultMapId] : [] as number[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // モーダルが開いたときに初期位置を設定
  useEffect(() => {
    if (isOpen && initialLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: initialLocation.lat.toString(),
        longitude: initialLocation.lng.toString(),
      }));
    }
  }, [isOpen, initialLocation]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('画像のサイズは5MB以下にしてください');
        return;
      }

      // ファイル形式チェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('画像はjpeg, jpg, pngのいずれかで選択してください');
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setError(null);

      // プレビュー表示
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapSelectionChange = (mapId: number) => {
    setFormData((prev) => {
      const currentMapIds = prev.map_ids || [];
      const isSelected = currentMapIds.includes(mapId);

      return {
        ...prev,
        map_ids: isSelected
          ? currentMapIds.filter((id) => id !== mapId)
          : [...currentMapIds, mapId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!formData.name.trim()) {
      setError('名前は必須です');
      return;
    }

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError('緯度は-90から90の範囲で入力してください');
      return;
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError('経度は-180から180の範囲で入力してください');
      return;
    }

    if (formData.memo && formData.memo.length > 500) {
      setError('メモは500文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // 送信用データを作成（緯度・経度を数値に変換）
      const submitData: CreateCustomPlaceRequest = {
        name: formData.name,
        latitude,
        longitude,
        image: formData.image,
        place_type: formData.place_type,
        memo: formData.memo,
        map_ids: formData.map_ids,
      };

      await createCustomPlace(submitData);

      // 成功時の処理
      if (onSuccess) {
        onSuccess();
      }

      // フォームをリセット
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        image: null,
        place_type: undefined,
        memo: '',
        map_ids: [],
      });
      setImagePreview(null);

      onClose();
    } catch (err: any) {
      console.error('カスタム地点作成エラー:', err);
      console.error('エラーレスポンス:', err.response?.data);

      // エラーメッセージを整形
      let errorMessage = 'カスタム地点の作成に失敗しました';
      if (err.response?.data) {
        const errorData = err.response.data;
        console.log('詳細なエラーデータ:', JSON.stringify(errorData, null, 2));

        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          // フィールドごとのエラーメッセージを整形（ネストも含む）
          const formatErrors = (obj: any, prefix = ''): string[] => {
            const messages: string[] = [];
            for (const [key, value] of Object.entries(obj)) {
              const fieldName = prefix ? `${prefix}.${key}` : key;
              if (Array.isArray(value)) {
                messages.push(`${fieldName}: ${value.join(', ')}`);
              } else if (typeof value === 'object' && value !== null) {
                messages.push(...formatErrors(value, fieldName));
              } else {
                messages.push(`${fieldName}: ${value}`);
              }
            }
            return messages;
          };

          const errors = formatErrors(errorData).join('\n');
          errorMessage = errors || JSON.stringify(errorData);
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            カスタム地点の登録
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* エラー表示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 東京タワー"
              required
              maxLength={100}
            />
          </div>

          {/* 位置情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                緯度 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="0.000001"
                min="-90"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                経度 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="0.000001"
                min="-180"
                max="180"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 画像 */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              画像
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="max-w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              jpeg, jpg, png形式、最大5MBまで
            </p>
          </div>

          {/* 種別 */}
          <div>
            <label htmlFor="place_type" className="block text-sm font-medium text-gray-700 mb-1">
              種別
            </label>
            <select
              id="place_type"
              name="place_type"
              value={formData.place_type || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">選択してください</option>
              {PLACE_TYPE_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>

          {/* メモ */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
              メモ
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="例: 夕日の時間帯が最も美しい"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.memo?.length || 0} / 500文字
            </p>
          </div>

          {/* 登録先マップ */}
          {availableMaps.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                登録先マップ
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableMaps.map((map) => (
                  <label
                    key={map.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.map_ids?.includes(map.id) || false}
                      onChange={() => handleMapSelectionChange(map.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{map.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登録中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
