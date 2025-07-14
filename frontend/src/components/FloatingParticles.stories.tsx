import type { Meta, StoryObj } from '@storybook/react';
import FloatingParticles from './FloatingParticles';

const meta: Meta<typeof FloatingParticles> = {
  title: 'Components/FloatingParticles',
  component: FloatingParticles,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FloatingParticles>;

export const Default: Story = {
  render: () => <div style={{ position: 'relative', height: 200, background: '#f0f4f8' }}><FloatingParticles /></div>,
}; 