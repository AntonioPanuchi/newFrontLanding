import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  render: () => <HeroSection />,
}; 