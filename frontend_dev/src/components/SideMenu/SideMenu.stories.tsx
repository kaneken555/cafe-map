// components/SideMenu/SideMenu.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SideMenu from './SideMenu';

const meta: Meta<typeof SideMenu> = {
  title: 'Components/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', background: '#f3f4f6', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};


export default meta;

type Story = StoryObj<typeof SideMenu>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => alert('SideMenu closed'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => alert('SideMenu closed'),
  },
};
