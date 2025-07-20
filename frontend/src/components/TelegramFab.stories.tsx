import type { Meta, StoryObj } from "@storybook/react";
import TelegramFab from "./TelegramFab";

const meta: Meta<typeof TelegramFab> = {
  title: "Components/TelegramFab",
  component: TelegramFab,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TelegramFab>;

export const Default: Story = {};
