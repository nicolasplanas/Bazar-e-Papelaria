import { useNavigate } from 'react-router-dom'
import { sair } from '../Auth'

function BotaoSair() {
  const navigate = useNavigate()

  const handleSair = () => {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <button className="botao-sair" onClick={handleSair}>
      Sair
    </button>
  )
}

export default BotaoSair