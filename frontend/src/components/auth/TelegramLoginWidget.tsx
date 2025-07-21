import Script from "next/script";

export default function TelegramLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">🔐 Войти через Telegram</h1>
        <Script
          async
          src="https://telegram.org/js/telegram-widget.js?7"
          strategy="afterInteractive"
          data-telegram-login="your_bot_username"
          data-size="large"
          data-userpic="false"
          data-request-access="write"
          data-onauth="onTelegramAuth"
        />
        <Script id="telegram-auth-handler" strategy="afterInteractive">
          {`
            function onTelegramAuth(user) {
              fetch("/api/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
              })
              .then((res) => {
                if (res.ok) window.location.href = "/admin/learning-insights";
                else alert("Ошибка авторизации через Telegram");
              });
            }
          `}
        </Script>
      </div>
    </div>
  );
}