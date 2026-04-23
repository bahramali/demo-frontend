import { useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function App() {
  const [name, setName] = useState('Diana')
  const [personnelNumber, setPersonnelNumber] = useState('12345')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [responseData, setResponseData] = useState(null)

  const requestUrl = useMemo(() => {
    if (!API_BASE_URL) {
      return ''
    }

    return `${API_BASE_URL.replace(/\/$/, '')}/api/demo`
  }, [])

  const status = loading
    ? 'loading'
    : error
      ? 'error'
      : responseData
        ? 'success'
        : 'idle'

  const handleSubmit = async () => {
    if (!requestUrl) {
      setError('Missing VITE_API_BASE_URL. Please set it in your .env file.')
      setResponseData(null)
      return
    }

    setLoading(true)
    setError('')
    setResponseData(null)

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, personnelNumber })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`)
      }

      setResponseData(data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unexpected request error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Demo Frontend</h1>
      <p className="note">Simple request/response demo against the backend API.</p>

      <div className="form">
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label>
          Personnel Number
          <input
            value={personnelNumber}
            onChange={(event) => setPersonnelNumber(event.target.value)}
          />
        </label>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      <section className="status" aria-live="polite">
        <h2>Status: {status}</h2>

        {status === 'idle' && <p>No request sent yet.</p>}
        {status === 'loading' && <p>Sending request to backend...</p>}
        {status === 'error' && <p className="error">Error: {error}</p>}
        {status === 'success' && <pre>{JSON.stringify(responseData, null, 2)}</pre>}
      </section>
    </main>
  )
}

export default App
