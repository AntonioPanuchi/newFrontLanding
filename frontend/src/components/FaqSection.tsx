import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import { useInView } from "../hooks/useInView";

const faqs = [
  {
    question: "Что такое ROX.VPN?",
    answer: "Это система мониторинга работоспособности VPN-серверов.",
  },
  {
    question: "Для чего предназначен сервис?",
    answer:
      "Он помогает отслеживать доступность серверов и не является рекламой VPN‑услуг.",
  },
  {
    question: "Где расположены серверы?",
    answer: "Сейчас используются площадки в Германии, Финляндии и США.",
  },
  {
    question: "Собираются ли персональные данные?",
    answer:
      "Нет, проект предназначен исключительно для технического мониторинга.",
  },
  {
    question: "Можно ли использовать результаты мониторинга?",
    answer: "Информация предоставляется в ознакомительных целях.",
  },
];

const FaqSection: React.FC = () => {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref}
      className={`py-16 sm:py-24 bg-bg dark:bg-slate-900 transition-colors duration-300 transition-opacity ${inView ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}
    >
      <div className="container mx-auto px-4 sm:px-8 max-w-3xl sm:max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center dark:text-gray-100">
          Часто задаваемые вопросы
        </h2>
        <Accordion.Root
          type="multiple"
          className="flex flex-col gap-6"
          collapsible
        >
          {faqs.map((faq, i) => (
            <Accordion.Item
              key={i}
              value={String(i)}
              className={`transition-shadow duration-300 rounded-2xl shadow-md bg-white/90 dark:bg-slate-800/90 border border-gray-100 dark:border-gray-700 overflow-hidden`}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 sm:py-6 text-left focus:outline-none group"
                  aria-label={`Показать ответ на вопрос: ${faq.question}`}
                >
                  <div className="flex items-center gap-3">
                    <FaQuestionCircle className="text-primary text-xl shrink-0" />
                    <span className="text-lg sm:text-xl font-semibold dark:text-gray-100">
                      {faq.question}
                    </span>
                  </div>
                  <FaChevronDown
                    className="text-accent text-xl transition-transform duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                className="transition-all duration-300 px-6 data-[state=open]:max-h-40 data-[state=open]:py-2 data-[state=open]:opacity-100 max-h-0 py-0 opacity-0 text-gray-700 dark:text-gray-300 text-base sm:text-lg"
                style={{ overflow: "hidden" }}
              >
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
};

export default FaqSection;
