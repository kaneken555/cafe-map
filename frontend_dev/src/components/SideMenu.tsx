// components/SideMenu.tsx
import React from "react";
import { ChevronsLeft } from "lucide-react";


interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 text-right">
        <button 
          onClick={onClose} 
          className="text-xl font-bold cursor-pointer"
        >
          <ChevronsLeft size={24} />
        </button>
      </div>
      <nav className="flex flex-col items-center space-y-6 mt-10 text-md font-medium">
        <a
          href="https://perfect-august-4fc.notion.site/Mappin-1e4ba3d0ae1b8085a82fe5eefaf9fe96?pvs=74"
          target="_blank"
          rel="noopener noreferrer"
        >
          アプリの使い方・よくある質問
        </a>
        <a href="#">運営会社について</a>
        <a
          href="https://perfect-august-4fc.notion.site/1e4ba3d0ae1b80dabec3ca45657e966d"
          target="_blank"
          rel="noopener noreferrer"
        >
          プライバシーポリシー
        </a>
        <a
          href="https://perfect-august-4fc.notion.site/1e4ba3d0ae1b80a9b678d58d18acdd34?pvs=74"
          target="_blank"
          rel="noopener noreferrer"
        >
          利用規約
        </a>
        <a href="#">フィードバック・ご要望</a>
        <a href="#">お問い合わせ</a>
      </nav>
    </div>
  );
};

export default SideMenu;
