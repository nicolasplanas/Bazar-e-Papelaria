import { useState } from 'react'
import { Link } from 'react-router-dom'

function Saida() {

  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e) => {
    
    e.preventDefault() // evita recarregar a página

    try {

      const res = await fetch('http://localhost:5000/saida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, quantidade }),
      })

      const dados = await res.json()

      if (!res.ok) {

        setMensagem(dados.erro)
        return

      }

      setMensagem(`Saída registrada! Estoque de ${dados.nome}: ${dados.quantidade}`)
      setNome('')
      setQuantidade('')
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    }
  }

  return (
    <section id="saida">
      <h1>Saída de Produto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Produto</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Registrar Saída</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </section>
  )
}

export default Saida