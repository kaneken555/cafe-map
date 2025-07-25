// components/FooterActions.tsx
import React from "react";
import { List as ListIcon, Map as MapIcon, Layers } from "lucide-react";
import HeaderButton from "../HeaderButton/HeaderButton";
import { ICON_SIZES } from "../../constants/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useMap } from "../../contexts/MapContext";


interface Props {
  onOpenCafeList: () => void;
  onOpenMapList: () => void;
  onShowMyCafeMap: () => void;
  isMyCafeListOpen: boolean;
}

const FooterActions: React.FC<Props> = ({
  onOpenCafeList,
  onOpenMapList,
  onShowMyCafeMap,
  isMyCafeListOpen,
}) => {
  const { user } = useAuth();
  const { mapMode, selectedMap } = useMap();

  if (!user) return null;


  return (
    <div className="fixed bottom-0 w-full h-16 bg-white border-t border-gray-300 grid grid-cols-3 items-center md:hidden z-50">
      <HeaderButton
        onClick={onOpenCafeList}
        disabled={!user}
        icon={<ListIcon size={ICON_SIZES.MEDIUM} />}
        label="My Café List"
        active={isMyCafeListOpen}
      />
      <HeaderButton
        onClick={onShowMyCafeMap}
        disabled={!user}
        icon={<MapIcon size={ICON_SIZES.MEDIUM} />}
        label="My Café Map"
        active={mapMode === "mycafe"}
      />
      <HeaderButton
        onClick={onOpenMapList}
        disabled={!user}
        icon={<Layers size={ICON_SIZES.MEDIUM} />}
        label={selectedMap?.name || "My Map List"}
        active={!!selectedMap}
      />
    </div>
  );
};

export default FooterActions;
