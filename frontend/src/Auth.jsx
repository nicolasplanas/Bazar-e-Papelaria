import { API_URL } from './api'

const CHAVE = 'token-estoque'

export function getToken() {
  return localStorage.getItem(CHAVE)
}

export function salvarToken(token) {
  localStorage.setItem(CHAVE, token)
}

export function sair() {
  localStorage.removeItem(CHAVE)
}

// usa no lugar do fetch: já envia o token e trata sessão expirada
export async function apiFetch(caminho, opcoes = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  })

  if (res.status === 401) {
    sair()
    window.location.href = '/login'
    throw new Error('Não autorizado')
  }
  return res
}

export async function sessaoValida() {
  const token = getToken()
  if (!token) return false

  try {
    const res = await fetch(`${API_URL}/api/sessao`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      sair()
      return false
    }
    return true
  } catch {
    return false
  }
}