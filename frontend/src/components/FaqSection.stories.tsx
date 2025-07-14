import type { Meta, StoryObj } from '@storybook/react';
import FaqSection from './FaqSection';

const meta: Meta<typeof FaqSection> = {
  title: 'Components/FaqSection',
  component: FaqSection,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FaqSection>;

export const Default: Story = {
  render: () => <FaqSection />,
}; 