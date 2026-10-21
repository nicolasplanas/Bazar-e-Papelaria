import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from './api'
import { salvarToken } from './Auth'

function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      })
      const dados = await res.json()

      if (!res.ok) {
        setErro(dados.erro || 'Erro ao entrar')
        return
      }

      salvarToken(dados.token)
      navigate('/', { replace: true })
    } catch {
      setErro('Não foi possível conectar ao servidor')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="login" className="login-box">
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="login-campo"
          type="text"
          placeholder="Usuário"
          autoComplete="username"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          className="login-campo"
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="botao-logs" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {erro && <p className="login-erro">{erro}</p>}
    </section>
  )
}

export default Login