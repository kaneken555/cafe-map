// components/CafeDetailCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CafeDetailCard from './CafeDetailCard';
import { Cafe } from '../../types/cafe';


const meta: Meta<typeof CafeDetailCard> = {
  title: 'Components/CafeDetailCard',
  component: CafeDetailCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '420px', border: '1px solid #ccc', padding: '8px', background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CafeDetailCard>;

export const Default: Story = {
  render: () => {
    const mockCafe: Cafe = {
      id: 1,
      placeId: 'abc123',
      name: 'サンプルカフェ',
      address: '東京都渋谷区1-2-3',
      openTime: '月曜日: 10:00～18:00, 火曜日: 10:00～18:00, 水曜日: 10:00～18:00',
      status: '営業中',
      distance: '300m',
      lat: 35.6595,
      lng: 139.7005,
      photoUrls: ['https://placehold.jp/300x200.png'],
      rating: 4.5,
      phoneNumber: '03-1234-5678',
      website: 'https://samplecafe.jp',
    };



    const [myCafeList] = useState<Cafe[]>([]);

    return (
      <CafeDetailCard
        cafe={mockCafe}
        myCafeList={myCafeList}
        onAddClick={() => console.log('＋ボタンがクリックされました')}
        onAddCafe={(cafe) => console.log(`♥ 登録: ${cafe.name}`)}
        onShareCafe={(cafe) => console.log(`🔗 共有: ${cafe.name}`)}
      />
    );
  },
};
