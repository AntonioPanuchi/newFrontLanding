import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Loading: Story = {
  args: {
    children: "Загрузка...",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    children: "Очень длинный текст кнопки для проверки переноса и адаптивности",
    variant: "primary",
  },
};

export const IconOnly: Story = {
  args: {
    children: (
      <span role="img" aria-label="иконка">
        🔒
      </span>
    ),
    "aria-label": "Заблокировано",
  },
};
