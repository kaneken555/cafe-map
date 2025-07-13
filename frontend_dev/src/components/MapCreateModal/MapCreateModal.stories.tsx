// components/MapCreateModal/MapCreateModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
// import { action } from '@storybook/addon-actions';
import MapCreateModal from './MapCreateModal';

const meta: Meta<typeof MapCreateModal> = {
  title: 'Components/MapCreateModal',
  component: MapCreateModal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MapCreateModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
      // action('onClose')();     // ✅ Actionタブに表示
      setIsOpen(false);        // ✅ モーダルを閉じる
    };

    // ✅ createNewMap に合わせたダミー関数
    const createMapMock = async (mapName: string, onClose: () => void) => {
      // action('createMap')(mapName); // ✅ 呼び出しログ（引数も表示）
      if (!mapName.trim()) {
        alert('マップ名を入力してください');
        return;
      }

      alert(`マップ「${mapName}」を作成しました（ダミー）`);
      onClose();
    };

    return (
      <MapCreateModal
        isOpen={isOpen}
        onClose={handleClose}
        createMap={createMapMock}
      />
    );
  },
};
