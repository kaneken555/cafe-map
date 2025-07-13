// components/HeaderButton/HeaderButton.stories.tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeaderButton from "./HeaderButton";
import { Map as MapIcon, List as ListIcon } from "lucide-react";

const meta: Meta<typeof HeaderButton> = {
  title: "Components/HeaderButton",
  component: HeaderButton,
};

export default meta;

type Story = StoryObj<typeof HeaderButton>;

export const Default: Story = {
  args: {
    onClick: () => alert("クリックされました"),
    disabled: false,
    icon: <MapIcon size={20} />,
    label: "Default",
    active: false,
  },
};

export const Active: Story = {
  args: {
    onClick: () => alert("アクティブ状態でクリック"),
    disabled: false,
    icon: <ListIcon size={20} />,
    label: "Active",
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    onClick: () => {},
    disabled: true,
    icon: <MapIcon size={20} />,
    label: "Disabled",
    active: false,
  },
};

export const Toggleable: Story = {
  render: () => {
    const [active, setActive] = useState(false);
    return (
      <HeaderButton
        onClick={() => setActive((prev) => !prev)}
        disabled={false}
        icon={<MapIcon size={20} />}
        label={active ? "アクティブ" : "非アクティブ"}
        active={active}
      />
    );
  },
};
