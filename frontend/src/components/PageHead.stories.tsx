import type { Meta, StoryObj } from '@storybook/react';
import PageHead from './PageHead';

const meta: Meta<typeof PageHead> = {
  title: 'Components/PageHead',
  component: PageHead,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Компонент для управления заголовками страниц и SEO мета-тегами. Автоматически добавляет "– ROX.VPN" к заголовку, если его там нет.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof PageHead>;

export const HomePage: Story = {
  args: {
    title: 'ROX.VPN – VPN за 30 секунд прямо в Telegram',
    description: 'Забудь про сложные настройки! ROX.VPN работает через Telegram-бота — просто нажми кнопку и получи быстрый защищённый интернет.',
    path: '/'
  }
};

export const ServersPage: Story = {
  args: {
    title: 'Статус серверов',
    description: 'Мониторинг статуса VPN серверов ROX.VPN в реальном времени. Проверьте доступность серверов в Германии, США и Финляндии.',
    path: '/servers'
  }
};

export const FaqPage: Story = {
  args: {
    title: 'Часто задаваемые вопросы',
    description: 'Ответы на часто задаваемые вопросы о ROX.VPN. Узнайте как начать пользоваться VPN, о безопасности, поддерживаемых устройствах и способах оплаты.',
    path: '/faq'
  }
};

export const NoIndex: Story = {
  args: {
    title: 'Страница без индексации',
    description: 'Эта страница не будет индексироваться поисковыми системами.',
    path: '/private',
    noIndex: true
  }
}; 

