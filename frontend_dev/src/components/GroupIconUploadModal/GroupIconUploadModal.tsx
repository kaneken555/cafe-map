// components/GroupIconUploadModal/GroupIconUploadModal.tsx
import React, { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import ModalActionButton from "../ModalActionButton/ModalActionButton";
import { ImagePlus, Save } from "lucide-react";

interface GroupIconUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  currentIcon: string | undefined;
  onUpload: (newIconUrl: string) => void;
}

const GroupIconUploadModal: React.FC<GroupIconUploadModalProps> = ({
  isOpen,
  onClose,
  groupName,
  currentIcon,
  onUpload,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentIcon);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (previewUrl) {
      onUpload(previewUrl); // 実際はAPIでアップロードしてURLを取得する
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="アイコン画像アップロード"
      icon={<ImagePlus className="w-6 h-6 text-[#6b4226]" />}
      size="sm"
    >
      <div className="space-y-4 text-center">
        <p className="font-semibold">{groupName}</p>
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <img
              src={previewUrl || "/default-icon.png"}
              alt="アイコンプレビュー"
              className="w-24 h-24 rounded-full border cursor-pointer object-cover"
            />
            <p className="text-blue-500 mt-2">画像を選択</p>
          </label>
        </div>

        <ModalActionButton
          label="登録"
          onClick={handleUpload}
          icon={<Save className="w-5 h-5" />}
          size="md"
        />
      </div>
    </BaseModal>
  );
};

export default GroupIconUploadModal;
