import type { Meta, StoryObj } from "@storybook/react";
import Features from "./Features";

const meta: Meta<typeof Features> = {
  title: "Components/Features",
  component: Features,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Features>;

export const Default: Story = {
  render: () => <Features />,
};

export const Empty: Story = {
  render: () => (
    <div className="p-8 text-center text-gray-400">Нет фич для отображения</div>
  ),
};

export const LongFeature: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-8 mb-4">
        <div className="font-bold text-xl mb-2">
          Очень длинный заголовок фичи, который проверяет перенос текста и
          адаптивность
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          Очень длинное описание фичи, чтобы проверить, как компонент
          справляется с большими объёмами текста и адаптацией под разные
          устройства.
        </div>
      </div>
    </div>
  ),
};

export const OneFeature: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-8 mb-4">
        <div className="font-bold text-xl mb-2">Только одна фича</div>
        <div className="text-gray-700 dark:text-gray-300">
          Проверьте отображение компонента, если фича всего одна.
        </div>
      </div>
    </div>
  ),
};
