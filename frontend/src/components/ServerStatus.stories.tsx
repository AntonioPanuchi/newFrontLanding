import type { Meta, StoryObj } from '@storybook/react';
import ServerStatus from './ServerStatus';

const meta: Meta<typeof ServerStatus> = {
  title: 'Components/ServerStatus',
  component: ServerStatus,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ServerStatus>;

export const Default: Story = {
  render: () => <ServerStatus />,
};
// Для тестирования состояний можно использовать msw или mockServiceWorker в Storybook, если настроено. 