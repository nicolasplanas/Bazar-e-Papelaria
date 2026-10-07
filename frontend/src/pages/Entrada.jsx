import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api'

function Entrada() {

  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [categoria, setCategoria] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e) => {

    e.preventDefault() // evita recarregar a página

    try {

      const res = await fetch(`${API_URL}/entrada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, quantidade, categoria }),
      })

      const dados = await res.json()

      if (!res.ok) {

        setMensagem(dados.erro)
        return
        
      }

      setMensagem(`Entrada registrada! Estoque de ${dados.nome}: ${dados.quantidade}`)
      setNome('')
      setQuantidade('')
      setCategoria('')
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    }
  }

  return (
    <section id="entrada">
      <h1>Entrada de Produto</h1>

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
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="papelaria">Papelaria</option>
            <option value="bomboniere">Bomboniere</option>
            <option value="sorvetes">Sorvetes</option>
            <option value="presentes">Presentes</option>
          </select>
        </div>

        <div>
          <button type="submit">Registrar Entrada</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </section>
  )
}

export default Entrada