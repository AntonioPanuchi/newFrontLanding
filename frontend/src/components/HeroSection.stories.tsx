import type { Meta, StoryObj } from "@storybook/react";
import HeroSection from "./HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Components/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  render: () => <HeroSection />,
};

export const LongTitle: Story = {
  render: () => (
    <div className="bg-hero-gradient p-8">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight tracking-tight text-white drop-shadow-lg">
        Очень длинный заголовок HeroSection, который проверяет перенос текста и
        адаптивность на разных экранах
      </h1>
    </div>
  ),
};

export const NoDescription: Story = {
  render: () => (
    <div className="bg-hero-gradient p-8">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight tracking-tight text-white drop-shadow-lg">
        Мониторинг <span className="text-primary">VPN</span>-серверов
      </h1>
      {/* Нет описания */}
    </div>
  ),
};

export const OneButton: Story = {
  render: () => (
    <div className="bg-hero-gradient p-8 text-center">
      <button className="px-8 py-4 rounded-3xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-wow">
        Статус серверов
      </button>
    </div>
  ),
};
