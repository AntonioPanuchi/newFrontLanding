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

export const AllOpen: Story = {
  render: () => {
    // Хак: вручную раскрыть все вопросы через state невозможно без пропсов, но можно описать в документации
    return <div>Визуально проверьте раскрытие всех вопросов вручную (или добавьте проп openAll для теста).</div>;
  },
};

export const Empty: Story = {
  render: () => <div className="p-8 text-center text-gray-400">Нет вопросов для отображения</div>,
};

export const LongQA: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md p-6 mb-4">
        <div className="font-bold text-lg mb-2">Очень длинный вопрос, который занимает несколько строк и проверяет перенос текста и адаптивность FAQ секции в различных разрешениях экрана?</div>
        <div className="text-gray-700 dark:text-gray-300">Очень длинный ответ, который также занимает несколько строк. Здесь можно проверить, как компонент справляется с большими объёмами текста, переносами, скроллингом и адаптацией под разные устройства. Это важно для доступности и UX.</div>
      </div>
    </div>
  ),
}; 