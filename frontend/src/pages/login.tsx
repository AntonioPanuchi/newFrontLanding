import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
    setLoading(false)
    if (res.ok) {
      window.location.href = '/admin/learning-insights'
    } else {
      const data = await res.json().catch(() => null)
      setError(data?.error || 'Login failed')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Войти в ROX.VPN</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-64">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        <p className="text-sm text-center">
          Нет аккаунта?{' '}
          <a href="/register" className="text-blue-600 underline">
            Регистрация
          </a>
        </p>
      </form>
    </main>
  )
}
