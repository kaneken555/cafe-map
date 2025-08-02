// components/GroupDetailModal/GroupDetailModal.tsx
import React, { useState, useEffect } from "react";
import BaseModal from "../BaseModal/BaseModal";
import GroupIconUploadModal from "../GroupIconUploadModal/GroupIconUploadModal";
import ModalActionButton from "../ModalActionButton/ModalActionButton";
import { Group } from "../../types/group";
import { Users, Edit2, Save } from "lucide-react";


interface GroupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onUpdateGroup: (updatedGroup: Group) => void; // グループ更新用のコールバック
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedGroup, setUpdatedGroup] = useState<Group | null>(group);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);


  // `group` が変更された場合に `updatedGroup` を更新する
  useEffect(() => {
    if (group) {
      setUpdatedGroup({ ...group }); // `group` が null でない場合に初期化
    }
  }, [group]);


  if (!group) return null;

  const handleUpdate = () => {
    if (updatedGroup) {
      onUpdateGroup(updatedGroup); // 更新処理を親に渡す
      setIsEditing(false); // 編集を終了
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Group) => {
    if (updatedGroup) {
      setUpdatedGroup({
        ...updatedGroup,
        [field]: e.target.value,
      });
    }
  };

  const handleIconUpload = (newIcon: string) => {
    setUpdatedGroup((prev) => {
      if (!prev) return prev;
      return { ...prev, icon: newIcon };
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="グループ詳細"
      icon={<Users className="w-6 h-6 text-[#6b4226]" />}
      size="md" // サイズを指定
    >
      <div className="space-y-4">
        {/* グループ名 */}
        <div>
          <strong>グループ名：</strong>
          {isEditing ? (
            <input
              type="text"
              value={updatedGroup?.name || ""}
              onChange={(e) => handleChange(e, "name")}
              className="w-full px-2 py-1 border rounded"
            />
          ) : (
            <span>{group.name}</span>
          )}
        </div>



        {/* アイコン画像 */}
        <div>
          <strong>アイコン画像：</strong>
          <div className="flex items-center space-x-2">
            <img
              src={updatedGroup?.icon || "/default-icon.png"}
              alt="グループアイコン"
              className="w-12 h-12 rounded-full border cursor-pointer object-cover"
              onClick={() => isEditing && setIsIconModalOpen(true)}
            />
            {isEditing && (
              <button className="text-blue-500 hover:text-blue-700 cursor-pointer">
                <Edit2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 説明 */}
        <div>
          <strong>説明：</strong>
          {isEditing ? (
            <input
              type="text"
              // value={updatedGroup.description}
              // onChange={(e) => handleChange(e, "description")}
              className="w-full px-2 py-1 border rounded"
            />
          ) : (
            <span>{group.description}</span>
          )}
        </div>

        {/* メンバー */}
        <div>
          <strong>メンバー：</strong>
          <ul>
            {/* {group.members.map((member, index) => (
              <li key={index}>{member.name}</li>
           ))} */}
          </ul>
        </div>

      {/* 編集モードトグルスイッチ */}
      <div className="flex items-center space-x-2 mt-4">
          <span>編集モード</span>
          <label className="inline-flex relative items-center cursor-pointer w-10 h-6">
            <input
              type="checkbox"
              checked={isEditing}
              onChange={() => setIsEditing(!isEditing)} // スイッチをトグル
              className="sr-only"
            />
            <span
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                isEditing ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out ${
                isEditing ? "transform translate-x-4 bg-green-500" : ""
              }`}
            ></span>
          </label>
          <span className="ml-2">{isEditing ? "ON" : "OFF"}</span>
        </div>

        {/* 更新ボタン */}
        {isEditing && (
            <ModalActionButton
            label="更新"
            onClick={handleUpdate}
            icon={<Save className="w-5 h-5" />}
            size="md"
          />
        )}
      </div>

      <GroupIconUploadModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        groupName={group.name}
        currentIcon={updatedGroup?.icon}
        onUpload={handleIconUpload}
      />

    </BaseModal>

    
  );
};

export default GroupDetailModal;
