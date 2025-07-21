import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [message, setMessage] = useState('Загрузка...')

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized')
        return res.json()
      })
      .then(data => setMessage(`Привет, ${data.user.username}`))
      .catch(() => {
        window.location.href = '/login'
      })
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Админ-панель</h1>
      <p>{message}</p>
    </main>
  )
}
