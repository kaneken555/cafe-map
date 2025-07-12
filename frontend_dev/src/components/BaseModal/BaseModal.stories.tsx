// components/BaseModal/BaseModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import BaseModal from './BaseModal';
import { Coffee } from 'lucide-react';


const meta: Meta<typeof BaseModal> = {
  title: 'Components/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', background: '#f3f4f6', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BaseModal>;

const Template = (args: any) => <BaseModal {...args} />;

export const Large: Story = {
  render: Template,
  args: {
    isOpen: true,
    onClose: () => alert('Modal closed'),
    title: 'Large Modal',
    icon: <Coffee />,
    size: 'lg',
    children: <p>これは大きいモーダルです。</p>,
  },
};

export const Medium: Story = {
  render: Template,
  args: {
    ...Large.args,
    title: 'Medium Modal',
    size: 'md',
    children: <p>これは中サイズのモーダルです。</p>,
  },
};

export const Small: Story = {
  render: Template,
  args: {
    ...Large.args,
    title: 'Small Modal',
    size: 'sm',
    children: <p>これは小さいモーダルです。</p>,
  },
};
