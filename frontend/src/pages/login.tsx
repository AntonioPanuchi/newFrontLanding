import TelegramLoginButton from '@/components/TelegramLoginButton'

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Войти в ROX.VPN</h1>

      <TelegramLoginButton
        botName="rx_test_ru_bot"
        onAuth={async (user) => {
          console.log('Данные от Telegram:', user)

          const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
            credentials: 'include',
          })

          const result = await res.json()
          console.log('Результат проверки на сервере:', result)

          if (result.status === 'ok') {
            window.location.href = '/dashboard' // ← вот эта строка отвечает за переход
          }
        }}
      />
    </main>
  )
}
