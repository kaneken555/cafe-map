// components/CloseModalButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import CloseModalButton from './CloseModalButton';


// Storybook に表示されるメタ情報
const meta: Meta<typeof CloseModalButton> = {
  title: 'Components/CloseModalButton',
  component: CloseModalButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CloseModalButton>;

export const Default: Story = {
  args: {
    onClose: () => alert('Close button clicked!'),
  },
};
