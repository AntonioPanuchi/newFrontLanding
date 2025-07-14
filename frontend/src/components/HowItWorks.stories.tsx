import type { Meta, StoryObj } from '@storybook/react';
import HowItWorks from './HowItWorks';

const meta: Meta<typeof HowItWorks> = {
  title: 'Components/HowItWorks',
  component: HowItWorks,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HowItWorks>;

export const Default: Story = {
  render: () => <HowItWorks />,
}; 