// components/FooterActions.tsx
import React from "react";
import { List as ListIcon, Layers } from "lucide-react";
import HeaderButton from "../HeaderButton/HeaderButton";
import { useAuth } from "../../contexts/AuthContext";
import { useMap } from "../../contexts/MapContext";


interface Props {
  onOpenCafeList: () => void;
  onOpenMapList: () => void;
  isMyCafeListOpen: boolean;
}

const FooterActions: React.FC<Props> = ({
  onOpenCafeList,
  onOpenMapList,
  isMyCafeListOpen,
}) => {
  const { user } = useAuth();
  const { selectedMap } = useMap();

  return (
    <div className="fixed bottom-0 w-full h-14 bg-white border-t border-gray-300 grid grid-cols-2 items-center md:hidden z-40">
      <HeaderButton
        onClick={onOpenCafeList}
        disabled={!user}
        icon={<ListIcon size={14} />}
        label="My Café List"
        active={isMyCafeListOpen}
        size="small"
        orientation="horizontal"
      />
      <HeaderButton
        onClick={onOpenMapList}
        disabled={!user}
        icon={<Layers size={14} />}
        label={selectedMap?.name || "My Map List"}
        active={!!selectedMap}
        size="small"
        orientation="horizontal"
      />
    </div>
  );
};

export default FooterActions;
