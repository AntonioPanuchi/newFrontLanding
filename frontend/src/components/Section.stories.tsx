import type { Meta, StoryObj } from '@storybook/react';
import Section from './Section';

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    title: 'Заголовок секции',
    children: 'Контент секции',
  },
}; 