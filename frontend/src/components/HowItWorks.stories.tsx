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

export const EmptySteps: Story = {
  render: () => <div className="p-8 text-center text-gray-400">Нет шагов для отображения</div>,
};

export const LongStep: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-8 mb-4">
        <div className="font-bold text-xl mb-2">Очень длинный заголовок шага, который проверяет перенос текста и адаптивность</div>
        <div className="text-gray-700 dark:text-gray-300">Очень длинное описание шага, чтобы проверить, как компонент справляется с большими объёмами текста и адаптацией под разные устройства.</div>
      </div>
    </div>
  ),
};

export const OneStep: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-8 mb-4">
        <div className="font-bold text-xl mb-2">Только один шаг</div>
        <div className="text-gray-700 dark:text-gray-300">Проверьте отображение компонента, если шаг всего один.</div>
      </div>
    </div>
  ),
}; 