// components/GroupListItem.tsx
import React from "react";
import { CheckCircle, Info, UserPlus } from "lucide-react";
import { Group } from "../types/group";
import toast from "react-hot-toast";

interface GroupListItemProps {
  group: Group;
  selectedGroupId: number | null;
  onSelect: (group: Group) => void;
  onInvite: (group: Group) => void;
}

const GroupListItem: React.FC<GroupListItemProps> = ({
  group,
  selectedGroupId,
  onSelect,
  onInvite,
}) => {
  const handleSelect = () => {
    onSelect(group);
    toast.success(`グループ「${group.name}」を選択しました`);
  };

  const handleInvite = () => {
    onInvite(group);
  };

  const handleInfo = () => {
    toast("グループ機能は未実装です");
  };

  return (
    <li className="flex justify-between items-center border px-4 py-2 rounded">
      <span className="truncate">{group.name}</span>
      <div className="flex space-x-2">
        {group.id === selectedGroupId ? (
          <div className="w-12 flex flex-col items-center text-green-600">
            <CheckCircle size={24} />
            <span className="text-sm">選択中</span>
          </div>
        ) : (
          <button
            onClick={handleSelect}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
            <CheckCircle size={24} />
            <span className="text-sm">選択</span>
          </button>
        )}

        <button
          onClick={handleInfo}
          className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
          <Info size={24} />
          <span className="text-sm">詳細</span>
        </button>

        <button
          onClick={handleInvite}
          className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
          <UserPlus size={24} />
          <span className="text-sm">招待</span>
        </button>
      </div>
    </li>
  );
};

export default GroupListItem;
