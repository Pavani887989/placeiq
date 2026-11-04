const BASE = 'http://localhost:8080'
const TOKEN = 'placeiq-token'
const USER = 'placeiq-user'

export const getToken = () => localStorage.getItem(TOKEN)

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER))
  } catch {
    return null
  }
}

export function saveSession(data) {
  localStorage.setItem(TOKEN, data.token)
  localStorage.setItem(USER, JSON.stringify({ fullName: data.fullName, email: data.email }))
}

export function clearSession() {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(USER)
}

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = 'Bearer ' + token

  let res
  try {
    res = await fetch(BASE + path, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Start the back end first.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (res.status === 401 && token) {
    clearSession()
    window.location.href = '/login'
  }
  if (!res.ok) {
    if (res.status === 400 && (!data || data.error === 'Bad Request')) {
      throw new Error('Please check the details you entered. The password needs at least 8 characters.')
    }
    throw new Error((data && data.error) || 'Something went wrong')
  }
  return data
}