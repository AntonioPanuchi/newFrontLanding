import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const DarkMode: Story = {
  render: () => {
    document.documentElement.classList.add('dark');
    return <Header />;
  },
};

export const MobileMenuOpen: Story = {
  render: () => {
    // Симулируем открытое меню через state hack
    // Storybook не поддерживает напрямую, но можно показать инструкцию
    return <div>Откройте мобильное меню вручную для проверки (или используйте визуальный тест).</div>;
  },
};

export const ThemeTooltip: Story = {
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: 'Наведите курсор на кнопку смены темы для отображения тултипа.'
      }
    }
  }
}; 
