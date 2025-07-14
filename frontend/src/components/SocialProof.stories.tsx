import type { Meta, StoryObj } from '@storybook/react';
import SocialProof from './SocialProof';

const meta: Meta<typeof SocialProof> = {
  title: 'Components/SocialProof',
  component: SocialProof,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SocialProof>;

export const Default: Story = {
  render: () => <SocialProof />,
}; 