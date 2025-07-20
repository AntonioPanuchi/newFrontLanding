import type { Meta, StoryObj } from "@storybook/react";
import SectionDivider from "./SectionDivider";

const meta: Meta<typeof SectionDivider> = {
  title: "Components/SectionDivider",
  component: SectionDivider,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SectionDivider>;

export const Default: Story = {};
