import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, sessaoValida } from '../lib/auth'
import BotaoSair from './BotaoSair'

function RotaProtegida({ children }) {
  const [estado, setEstado] = useState(() => (getToken() ? 'verificando' : 'negado'))

  useEffect(() => {
    let cancelado = false

    sessaoValida().then((ok) => {
      if (!cancelado) setEstado(ok ? 'ok' : 'negado')
    })

    return () => {
      cancelado = true
    }
  }, [])

  if (estado === 'verificando') return <p>Verificando sessão...</p>
  if (estado === 'negado') return <Navigate to="/login" replace />
  
  return ( 
    <>
      <BotaoSair />
      {children}
    </>
  )
    
}

export default RotaProtegida