import { useEffect } from 'react'

type Props = {
  botName: string
  onAuth: (user: any) => void
}

export default function TelegramLoginButton({ botName, onAuth }: Props) {
  useEffect(() => {
    // Создаём глобальный обработчик
    (window as any).TelegramLoginWidget = {
      dataOnauth: onAuth,
    }

    // Подключаем Telegram script
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?7"
    script.setAttribute("data-telegram-login", botName)
    script.setAttribute("data-size", "large")
    script.setAttribute("data-radius", "10")
    script.setAttribute("data-userpic", "false")
    script.setAttribute("data-request-access", "write")
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)")
    script.async = true

    const container = document.getElementById("telegram-button-container")
    if (container) {
      container.innerHTML = ""
      container.appendChild(script)
    }
  }, [botName, onAuth])

  return <div id="telegram-button-container" className="telegram-login" />
}
