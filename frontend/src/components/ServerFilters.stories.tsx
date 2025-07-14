import type { Meta, StoryObj } from '@storybook/react';
import ServerFilters from './ServerFilters';

const meta: Meta<typeof ServerFilters> = {
  title: 'Components/ServerFilters',
  component: ServerFilters,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ServerFilters>;

export const All: Story = {
  args: {
    filter: 'all',
    setFilter: () => alert('setFilter: all'),
  },
};
export const Online: Story = {
  args: {
    filter: 'online',
    setFilter: () => alert('setFilter: online'),
  },
};
export const Offline: Story = {
  args: {
    filter: 'offline',
    setFilter: () => alert('setFilter: offline'),
  },
}; 