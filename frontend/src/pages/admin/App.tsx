import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [message, setMessage] = useState('Загрузка...')

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')

    if (!token) {
      window.location.href = '/login'
      return
    }

    fetch('/api/admin/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized')
        return res.json()
      })
      .then(data => setMessage(data.message))
      .catch(() => {
        localStorage.removeItem('jwt_token')
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
