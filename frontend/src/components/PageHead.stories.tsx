import type { Meta, StoryObj } from "@storybook/react";
import PageHead from "./PageHead";

const meta: Meta<typeof PageHead> = {
  title: "Components/PageHead",
  component: PageHead,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Компонент для управления заголовками страниц и SEO мета-тегами. Автоматически добавляет "– ROX.VPN" к заголовку, если его там нет.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PageHead>;

export const HomePage: Story = {
  args: {
    title: "ROX.VPN – мониторинг серверов",
    description:
      "Сервис предоставляет информацию о доступности VPN-серверов. Данные носят технический характер и не являются рекламой.",
    path: "/",
  },
};

export const ServersPage: Story = {
  args: {
    title: "Статус серверов",
    description:
      "Мониторинг доступности серверов ROX.VPN. Информация используется исключительно в технических целях.",
    path: "/servers",
  },
};

export const FaqPage: Story = {
  args: {
    title: "Часто задаваемые вопросы",
    description:
      "Ответы на вопросы о системе мониторинга ROX.VPN. Сервис не предназначен для продвижения VPN-услуг.",
    path: "/faq",
  },
};

export const NoIndex: Story = {
  args: {
    title: "Страница без индексации",
    description: "Эта страница не будет индексироваться поисковыми системами.",
    path: "/private",
    noIndex: true,
  },
};
