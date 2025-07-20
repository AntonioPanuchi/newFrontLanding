import type { Meta, StoryObj } from "@storybook/react";
import AnimatedCounter from "./AnimatedCounter";

const meta: Meta<typeof AnimatedCounter> = {
  title: "Components/AnimatedCounter",
  component: AnimatedCounter,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  args: { value: 100 },
};
