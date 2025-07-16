import type { Meta, StoryObj } from '@storybook/react';
import ServerCardSkeleton from './ServerCardSkeleton';

const meta: Meta<typeof ServerCardSkeleton> = {
  title: 'Components/ServerCardSkeleton',
  component: ServerCardSkeleton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ServerCardSkeleton>;

export const Default: Story = {};
