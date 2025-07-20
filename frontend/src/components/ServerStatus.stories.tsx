import type { Meta, StoryObj } from "@storybook/react";
import ServerStatus from "./ServerStatus";
import ServerCardSkeleton from "./ServerCardSkeleton";

const meta: Meta<typeof ServerStatus> = {
  title: "Components/ServerStatus",
  component: ServerStatus,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ServerStatus>;

export const Default: Story = {
  render: () => <ServerStatus />,
};

export const Loading: Story = {
  render: () => (
    <section className="py-20 sm:py-28 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">
          Статус серверов
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-14">
          {[...Array(3)].map((_, i) => (
            <ServerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="p-8 text-center text-red-500">Ошибка загрузки серверов</div>
  ),
};

export const Empty: Story = {
  render: () => (
    <section className="py-20 sm:py-28 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">
          Статус серверов
        </h2>
        <div className="text-center text-gray-400">Нет доступных серверов</div>
      </div>
    </section>
  ),
};

export const OneOnline: Story = {
  render: () => (
    <section className="py-20 sm:py-28 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">
          Статус серверов
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-14">
          <div className="relative flex flex-col items-center justify-between min-h-[280px] sm:min-h-[360px] bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden px-6 sm:px-10 md:px-14 py-8 sm:py-12">
            <span className="absolute left-0 top-0 h-full w-2 bg-green-400 rounded-l-3xl" />
            <div className="flex flex-col items-center gap-3 w-full">
              <span className="text-xl sm:text-2xl font-bold dark:text-gray-100">
                Germany
              </span>
              <span className="font-semibold text-green-600">🟢 Онлайн</span>
              <div className="text-4xl sm:text-5xl font-black dark:text-gray-100">
                42 <span className="text-lg font-normal">мс</span>
              </div>
              <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-300">
                Пинг
              </div>
              <div className="text-3xl sm:text-4xl font-bold dark:text-gray-100">
                123
              </div>
              <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-300">
                Пользователей
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
};

export const AllOffline: Story = {
  render: () => (
    <section className="py-20 sm:py-28 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-bold mb-12 text-center dark:text-gray-100">
          Статус серверов
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-14">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-between min-h-[280px] sm:min-h-[360px] bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden px-6 sm:px-10 md:px-14 py-8 sm:py-12"
            >
              <span className="absolute left-0 top-0 h-full w-2 bg-red-400 rounded-l-3xl" />
              <div className="flex flex-col items-center gap-3 w-full">
                <span className="text-xl sm:text-2xl font-bold dark:text-gray-100">
                  Server {i}
                </span>
                <span className="font-semibold text-red-500">🔴 Оффлайн</span>
                <div className="text-4xl sm:text-5xl font-black dark:text-gray-100">
                  — <span className="text-lg font-normal">мс</span>
                </div>
                <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-300">
                  Пинг
                </div>
                <div className="text-3xl sm:text-4xl font-bold dark:text-gray-100">
                  0
                </div>
                <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-300">
                  Пользователей
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
// Для тестирования состояний можно использовать msw или mockServiceWorker в Storybook, если настроено.
